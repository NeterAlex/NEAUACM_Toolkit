/* eslint-disable @typescript-eslint/no-explicit-any */
// noinspection NonAsciiCharacters

import PizZipUtils from "pizzip/utils";
import PizZip from "pizzip";
import Docxtemplater from "docxtemplater";
import { saveAs } from "file-saver";

interface StudentInfo {
  班级: string;
  姓名: string;
  学院: string;
  学号: string;
  辅导员: string;
}

interface ClassInfoList {
  班级: string;
  info: StudentInfo[];
}

interface DocBuilderParam {
  college: string;
  year: number;
  classInfoList: ClassInfoList[];
  trainDateList: Date[];
  signDate: Date;
  reason: "ACM集训队训练" | string;
  conflictWith: "晚自习" | "上课" | string;
  alignName: boolean;
}

interface genDocParams {
  jsonStr: string;
  year: number;
  trainDateList: Date[];
  signDate: Date;
  reason: string;
  conflictWith: string;
  alignName: boolean;
}

export function formatDate(date: Date) {
  const year = date.getFullYear();
  const month = date.getMonth() + 1;
  const day = date.getDate();
  return `${year}年${month}月${day}日`;
}

export function genYearsList() {
  const currentYear = new Date().getFullYear();
  return [currentYear, currentYear - 1, currentYear - 2, currentYear - 3, currentYear - 4];
}

export function organiseData(jsonStr: string) {
  try {
    const students: StudentInfo[] = JSON.parse(jsonStr);
    const stuGrpByCollege = students.reduce((acc: any, student) => {
      const college = student["学院"];
      if (!acc[college]) acc[college] = [];
      acc[college].push(student);
      return acc;
    }, {});

    for (const college in stuGrpByCollege) {
      if (Object.hasOwnProperty.call(stuGrpByCollege, college)) {
        const collegeGroup = stuGrpByCollege[college];
        stuGrpByCollege[college] = collegeGroup.reduce((collegeAccumulator: any, student: any) => {
          const instructor = student["辅导员"];
          const className = student["班级"];
          if (!collegeAccumulator[instructor]) collegeAccumulator[instructor] = {};
          if (!collegeAccumulator[instructor][className]) collegeAccumulator[instructor][className] = [];
          collegeAccumulator[instructor][className].push(student);
          return collegeAccumulator;
        }, {});
      }
    }

    for (const college in stuGrpByCollege) {
      if (Object.prototype.hasOwnProperty.call(stuGrpByCollege, college)) {
        // 遍历当前学院下的所有辅导员
        const instructors = stuGrpByCollege[college];
        for (const instructor in instructors) {
          if (Object.prototype.hasOwnProperty.call(instructors, instructor)) {
            // 遍历当前辅导员下的所有班级
            const classes = instructors[instructor];
            const classInfoList = [];
            for (const className in classes) {
              if (Object.prototype.hasOwnProperty.call(classes, className)) {
                const studentList: StudentInfo[] = [];
                // 遍历当前班级下的所有学生
                const studentsInClass = classes[className];
                studentsInClass.forEach((student: StudentInfo) => studentList.push(student));
                classInfoList.push({ 班级: className, info: studentList });
              }
            }
          }
        }
        return stuGrpByCollege;
      }
    }
  } catch {
    return;
  }
}

export function genDoc({
  jsonStr,
  year,
  trainDateList,
  signDate,
  reason,
  conflictWith,
  alignName,
}: genDocParams): void {
  const students: StudentInfo[] = JSON.parse(jsonStr);

  const stuGrpByCollege = students.reduce((acc: any, student) => {
    const college = student["学院"];
    if (!acc[college]) acc[college] = [];
    acc[college].push(student);
    return acc;
  }, {});

  for (const college in stuGrpByCollege) {
    if (Object.hasOwnProperty.call(stuGrpByCollege, college)) {
      const collegeGroup = stuGrpByCollege[college];
      stuGrpByCollege[college] = collegeGroup.reduce((collegeAccumulator: any, student: any) => {
        const instructor = student["辅导员"];
        const className = student["班级"];
        if (!collegeAccumulator[instructor]) collegeAccumulator[instructor] = {};
        if (!collegeAccumulator[instructor][className]) collegeAccumulator[instructor][className] = [];
        collegeAccumulator[instructor][className].push(student);
        return collegeAccumulator;
      }, {});
    }
  }

  for (const college in stuGrpByCollege) {
    if (Object.prototype.hasOwnProperty.call(stuGrpByCollege, college)) {
      // 遍历当前学院下的所有辅导员
      const instructors = stuGrpByCollege[college];
      for (const instructor in instructors) {
        if (Object.prototype.hasOwnProperty.call(instructors, instructor)) {
          // 遍历当前辅导员下的所有班级
          const classes = instructors[instructor];
          const classInfoList = [];
          for (const className in classes) {
            if (Object.prototype.hasOwnProperty.call(classes, className)) {
              const studentList: StudentInfo[] = [];
              // 遍历当前班级下的所有学生
              const studentsInClass = classes[className];
              studentsInClass.forEach((student: StudentInfo) => studentList.push(student));
              classInfoList.push({ 班级: className, info: studentList });
            }
          }
          classInfoList.sort((a, b) => a.班级.localeCompare(b.班级));
          buildDoc({
            college,
            year,
            classInfoList,
            trainDateList,
            signDate,
            reason,
            conflictWith,
            alignName,
          });
        }
      }
    }
  }
}

function loadFile(url: string, callback: any) {
  PizZipUtils.getBinaryContent(url, callback);
}

export function buildDoc({
  college,
  year,
  classInfoList,
  trainDateList,
  signDate,
  reason,
  conflictWith,
  alignName,
}: DocBuilderParam) {
  loadFile("/leave_note.docx", (error: Error, content: any) => {
    if (error) throw error;
    if (alignName) {
      for (const classInfo of classInfoList) {
        classInfo.info.forEach((item) => {
          if (/^[\u4e00-\u9fa5]{2}$/.test(item.姓名)) {
            item.姓名 = `${item.姓名[0]}　${item.姓名[1]}`;
          }
        });
      }
    }
    const zip = new PizZip(content);
    const doc = new Docxtemplater(zip, {
      paragraphLoop: true,
      linebreaks: true,
    });
    doc.render({
      college: college,
      year: year,
      student_nums: classInfoList.reduce((sum, item) => sum + item.info.length, 0),
      train_date: trainDateList.map(formatDate).join("、"),
      leave_days: trainDateList.length,
      sign_date: formatDate(signDate),
      classes: classInfoList,
      conflict_with: conflictWith.trim(),
      reason: reason.trim(),
    });
    const out = doc.getZip().generate({
      type: "blob",
      mimeType: "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
    });
    saveAs(out, `假条-${college}.docx`);
  });
}
