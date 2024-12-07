"use client";

import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { InputOTP, InputOTPGroup, InputOTPSeparator, InputOTPSlot } from "@/components/ui/input-otp";
import { Button } from "@/components/ui/button";

export default function CertificateEditorPage() {
  const [name, setName] = useState("");

  return (
    <div className="container mx-auto py-6">
      <div className="flex justify-center gap-6">
        <Card className="lg:w-1/3">
          <CardHeader>
            <CardTitle>证书信息</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div>
                <label htmlFor="prize" className="block text-sm font-medium text-gray-700">
                  赛别
                </label>
                <Select defaultValue="11">
                  <SelectTrigger>
                    <SelectValue placeholder="选择赛别" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem key="11" value="11">
                      第十一届程序设计竞赛
                    </SelectItem>
                    <SelectItem key="10" value="10">
                      第十届程序设计竞赛
                    </SelectItem>
                    <SelectItem key="test" value="test">
                      测试赛
                    </SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="flex gap-5">
                <div className="w-1/2">
                  <label htmlFor="name" className="block text-sm font-medium text-gray-700">
                    姓名
                  </label>
                  <Input
                    placeholder="姓名"
                    id="name"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="mt-1"
                  />
                </div>
                <div className="w-1/2">
                  <label htmlFor="eng_name" className="block text-sm font-medium text-gray-700">
                    英文名
                  </label>
                  <Input placeholder="Xing Ming" id="eng_name" className="mt-1" />
                </div>
              </div>

              <div>
                <label htmlFor="prize" className="block text-sm font-medium text-gray-700">
                  奖项
                </label>
                <Select defaultValue="gold">
                  <SelectTrigger>
                    <SelectValue placeholder="选择奖项" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem key="gold" value="gold">
                      金奖/Gold Medal
                    </SelectItem>
                    <SelectItem key="silver" value="silver">
                      银奖/Silver Medal
                    </SelectItem>
                    <SelectItem key="bronze" value="bronze">
                      铜奖/Bronze Medal
                    </SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="flex flex-row items-center justify-between rounded-lg border p-4">
                <div className="space-y-1">
                  <label className="text-sm">临时证书</label>
                </div>
                <Switch />
                <div className="space-y-0.5">
                  <label className="text-sm">打印模式</label>
                </div>
                <Switch />
              </div>
            </div>
          </CardContent>
        </Card>
        <Card className="lg:w-1/3">
          <CardContent className="h-full">
            <div className="flex flex-col justify-center items-center h-full w-full gap-4">
              <p className="text-gray-400">预览及下载证书前，需要输入验证码</p>
              <InputOTP maxLength={6}>
                <InputOTPGroup>
                  <InputOTPSlot index={0} />
                  <InputOTPSlot index={1} />
                  <InputOTPSlot index={2} />
                </InputOTPGroup>
                <InputOTPSeparator />
                <InputOTPGroup>
                  <InputOTPSlot index={3} />
                  <InputOTPSlot index={4} />
                  <InputOTPSlot index={5} />
                </InputOTPGroup>
              </InputOTP>
              <Button disabled>预览</Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
