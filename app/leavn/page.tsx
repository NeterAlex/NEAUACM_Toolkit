"use client";
import Papa from "papaparse";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { format } from "date-fns";
import { CalendarIcon } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { genDoc, genYearsList, organiseData } from "@/lib/leaveNoteUtils";
import ReactJson from "@microlink/react-json-view";

const formSchema = z.object({
  trainingDates: z.array(z.date()).min(1, {
    message: "请至少选择一个培训日期",
  }),
  studentGrade: z.string({
    required_error: "请选择学生年级",
  }),
  leaveReason: z.string().min(2, {
    message: "请填写请假事由",
  }),
  conflictContent: z.string({
    required_error: "请选择冲突内容",
  }),
  signatureDate: z.date({
    required_error: "请选择签名日期",
  }),
  signature: z.string().min(2, {
    message: "请填写签名落款",
  }),
  alignName: z.boolean().default(false),
  jsonField: z.string().refine(
    (val) => {
      try {
        Papa.parse(val, {
          header: true,
        });
        return true;
      } catch {
        return false;
      }
    },
    {
      message: "请输入有效的JSON",
    }
  ),
});

export default function LeaveFormPage() {
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      trainingDates: [],
      alignName: true,
      jsonField: "",
      leaveReason: "ACM集训队训练",
      conflictContent: "晚自习",
      studentGrade: genYearsList()[0].toString(),
      signatureDate: new Date(),
      signature: "电气与信息学院",
    },
  });

  function onSubmit(values: z.infer<typeof formSchema>) {
    genDoc({
      jsonStr: JSON.stringify(
        Papa.parse(values.jsonField.trim(), {
          header: true,
        }).data
      ),
      year: parseInt(values.studentGrade),
      trainDateList: values.trainingDates,
      signDate: values.signatureDate,
      reason: values.leaveReason,
      conflictWith: values.conflictContent,
      alignName: values.alignName,
    });
  }

  return (
    <div className="container mx-auto py-6">
      <div className="flex justify-center flex-col lg:flex-row gap-6">
        <div className="w-full lg:w-1/3">
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
              <FormField
                control={form.control}
                name="jsonField"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>数据 CSV</FormLabel>
                    <FormControl>
                      <Textarea
                        placeholder="CSV 应包含如下字段：班级、姓名、学号、学院、辅导员（不限顺序）"
                        {...field}
                        rows={2}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="trainingDates"
                render={({ field }) => (
                  <FormItem className="flex flex-col">
                    <FormLabel>培训日期</FormLabel>
                    <Popover>
                      <PopoverTrigger asChild>
                        <FormControl>
                          <Button
                            variant={"outline"}
                            className={cn(
                              "w-full justify-start text-left font-normal",
                              !field.value && "text-muted-foreground"
                            )}
                          >
                            <CalendarIcon className="mr-2 h-4 w-4" />
                            {field.value?.length > 0 ? (
                              field.value.length > 3 ? (
                                <span>{field.value.length} 个日期已选择</span>
                              ) : (
                                field.value.map((date) => format(date, "yyyy/MM/dd")).join(", ")
                              )
                            ) : (
                              <span>选择日期(可多选)</span>
                            )}
                          </Button>
                        </FormControl>
                      </PopoverTrigger>
                      <PopoverContent className="w-auto p-0" align="start">
                        <Calendar mode="multiple" selected={field.value} onSelect={field.onChange} initialFocus />
                      </PopoverContent>
                    </Popover>
                    <FormMessage />
                    {field.value?.length > 0 && (
                      <div className="flex flex-wrap gap-1 mt-2">
                        {field.value.map((date) => (
                          <Badge key={date.toISOString()} variant="secondary">
                            {format(date, "yyyy/MM/dd")}
                          </Badge>
                        ))}
                      </div>
                    )}
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="studentGrade"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>学生年级</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="选择年级" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {genYearsList().map((item) => (
                          <SelectItem key={item} value={item.toString()}>
                            {item}级
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="leaveReason"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>请假事由</FormLabel>
                    <FormControl>
                      <Input placeholder="请输入请假事由" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="conflictContent"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>冲突内容</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="选择冲突内容" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="晚自习">晚自习</SelectItem>
                        <SelectItem value="课程">课程</SelectItem>
                        <SelectItem value="其他活动">其他活动</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="signatureDate"
                render={({ field }) => (
                  <FormItem className="flex flex-col">
                    <FormLabel>签名日期</FormLabel>
                    <Popover>
                      <PopoverTrigger asChild>
                        <FormControl>
                          <Button
                            variant={"outline"}
                            className={cn("w-full pl-3 text-left font-normal", !field.value && "text-muted-foreground")}
                          >
                            {field.value ? format(field.value, "yyyy/MM/dd") : <span>选择日期</span>}
                            <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                          </Button>
                        </FormControl>
                      </PopoverTrigger>
                      <PopoverContent className="w-auto p-0" align="start">
                        <Calendar mode="single" selected={field.value} onSelect={field.onChange} initialFocus />
                      </PopoverContent>
                    </Popover>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="signature"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>签名落款</FormLabel>
                    <FormControl>
                      <Input placeholder="请输入签名落款" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="alignName"
                render={({ field }) => (
                  <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                    <div className="space-y-0.5">
                      <FormLabel className="text-sm">对齐姓名</FormLabel>
                    </div>
                    <FormControl>
                      <Switch checked={field.value} onCheckedChange={field.onChange} />
                    </FormControl>
                  </FormItem>
                )}
              />

              <Button type="submit" className="w-full">
                提交并生成
              </Button>

              <div className="flex justify-center">
                <Badge variant="secondary">若文件下载不成功或下载不全，请授予自动下载权限</Badge>
              </div>
            </form>
          </Form>
        </div>

        <div className="w-full lg:w-1/3">
          <Card className={""}>
            <CardHeader>
              <CardTitle>预览</CardTitle>
              <CardDescription>请确认信息准确</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div>
                  <h3 className="font-semibold pb-2">数据解析</h3>
                  <ReactJson
                    src={organiseData(
                      JSON.stringify(
                        Papa.parse(form.watch("jsonField").trim(), {
                          header: true,
                        }).data
                      ) || "未检测到有效JSON"
                    )}
                    collapsed={2}
                    enableClipboard={false}
                    name="CSV"
                    iconStyle={"square"}
                    displayDataTypes={false}
                  />
                </div>
                <div>
                  <h3 className="font-semibold">培训日期</h3>
                  <p>
                    {form.watch("trainingDates")?.length > 0
                      ? form
                          .watch("trainingDates")
                          .map((date) => format(date, "yyyy年MM月dd日"))
                          .join(", ")
                      : "未选择"}
                  </p>
                </div>
                <div>
                  <h3 className="font-semibold">学生年级</h3>
                  <p>{form.watch("studentGrade")}级</p>
                </div>
                <div>
                  <h3 className="font-semibold">事由</h3>
                  <p>
                    参加 <span className={"bg-[#3358D4]/10"}>{form.watch("leaveReason")}</span>，与{" "}
                    <span className={"bg-[#3358D4]/10"}>{form.watch("conflictContent")}</span> 冲突
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
