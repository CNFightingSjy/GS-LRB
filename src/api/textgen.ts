import cgiRequestor from "@/utils/request.ts";
import { AxiosResponse } from "axios";

interface TextgenDescriptor {
    title: string; // 推理请求标题
    brief: string; // 推理的简短描述 or 上下文
    emotion?: string; // 与请求相关的情感
}
type TextgenRequestParams = TextgenDescriptor;
type TextgenRequestResponse = {
    content_stream: string;
    id: string;
};
export function fetchTextgen({ title, brief, emotion }: TextgenRequestParams): Promise<AxiosResponse<TextgenRequestResponse>> {
    return cgiRequestor.post('/v1/api/chat', {
        title,
        brief,
        emotion
    })
}