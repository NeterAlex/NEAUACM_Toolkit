"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

export default function DataConversionPage() {
  const [csvInput, setCsvInput] = useState("");
  const [jsonOutput, setJsonOutput] = useState("");
  const [base64Input, setBase64Input] = useState("");
  const [base64Output, setBase64Output] = useState("");
  const [urlInput, setUrlInput] = useState("");
  const [urlOutput, setUrlOutput] = useState("");

  const convertCsvToJson = () => {
    try {
      const rows = csvInput.split("\n");
      const headers = rows[0].split(",");
      const jsonData = rows.slice(1).map((row) => {
        const values = row.split(",");
        return headers.reduce(
          (obj, header, index) => {
            obj[header.trim()] = values[index]?.trim() || "";
            return obj;
          },
          {} as Record<string, string>
        );
      });
      setJsonOutput(JSON.stringify(jsonData, null, 2));
    } catch {
      setJsonOutput("Error: Invalid CSV format");
    }
  };

  const encodeBase64 = () => {
    try {
      setBase64Output(btoa(base64Input));
    } catch {
      setBase64Output("Error: Invalid input");
    }
  };

  const decodeBase64 = () => {
    try {
      setBase64Output(atob(base64Input));
    } catch {
      setBase64Output("Error: Invalid Base64 input");
    }
  };

  const encodeURL = () => {
    try {
      setUrlOutput(encodeURIComponent(urlInput));
    } catch {
      setUrlOutput("Error: Invalid input");
    }
  };

  const decodeURL = () => {
    try {
      setUrlOutput(decodeURIComponent(urlInput));
    } catch {
      setUrlOutput("Error: Invalid URL-encoded input");
    }
  };

  return (
    <div className="container mx-auto py-6 lg:w-2/3">
      <Tabs defaultValue="csv-json">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="csv-json">CSV 转 JSON</TabsTrigger>
          <TabsTrigger value="base64">Base64 编解码</TabsTrigger>
          <TabsTrigger value="url">URL 编解码</TabsTrigger>
        </TabsList>
        <TabsContent value="csv-json">
          <Card>
            <CardHeader>
              <CardTitle>CSV 转 JSON</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Textarea
                    placeholder="输入 CSV 数据..."
                    value={csvInput}
                    onChange={(e) => setCsvInput(e.target.value)}
                    className="h-[200px]"
                  />
                </div>
                <div>
                  <Textarea value={jsonOutput} readOnly className="h-[200px]" />
                </div>
              </div>
              <Button onClick={convertCsvToJson} className="mt-4">
                转换为 JSON
              </Button>
            </CardContent>
          </Card>
        </TabsContent>
        <TabsContent value="base64">
          <Card>
            <CardHeader>
              <CardTitle>Base64 编解码</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Textarea
                    placeholder="输入文本..."
                    value={base64Input}
                    onChange={(e) => setBase64Input(e.target.value)}
                    className="h-[200px]"
                  />
                </div>
                <div>
                  <Textarea value={base64Output} readOnly className="h-[200px]" />
                </div>
              </div>
              <div className="flex gap-4 mt-4">
                <Button onClick={encodeBase64}>编码</Button>
                <Button onClick={decodeBase64}>解码</Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        <TabsContent value="url">
          <Card>
            <CardHeader>
              <CardTitle>URL 编解码</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Textarea
                    placeholder="输入 URL..."
                    value={urlInput}
                    onChange={(e) => setUrlInput(e.target.value)}
                    className="h-[200px]"
                  />
                </div>
                <div>
                  <Textarea value={urlOutput} readOnly className="h-[200px]" />
                </div>
              </div>
              <div className="flex gap-4 mt-4">
                <Button onClick={encodeURL}>编码</Button>
                <Button onClick={decodeURL}>解码</Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
