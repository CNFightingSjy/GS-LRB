import { CGI_BASE_URL } from "@/api/config.ts";
import { EventSourceMessage, fetchEventSource } from "@microsoft/fetch-event-source";

interface TextgenDescriptor {
    title: string; // 推理请求标题
    brief: string; // 推理的简短描述 or 上下文
    emotion?: string; // 与请求相关的情感
    type: string; // 文案类型字段
    token: string; // 邀请码
}
interface EventSourceCallbackDescriptor<T> {
    onOpen: (response: Response) => void;
    onMessage: (msg: T) => void;
    onClose: () => void;
    onError: (err: Error) => void;
}
export type TextgenReponseStreamData = {
    contentStream: string;
    event: string;
    id: string;
};

export function fetchTextgen({ title, brief, emotion, type, token }: TextgenDescriptor, { onOpen, onMessage, onClose, onError }: EventSourceCallbackDescriptor<TextgenReponseStreamData>) {
    const ctrl = new AbortController();
    fetchEventSource(`${CGI_BASE_URL}/v1/api/chat`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'X-GsMatrix-Auth': token,
        },
        body: JSON.stringify({ title, brief, emotion, type, token }),
        signal: ctrl.signal,
        async onopen(response) {
            onOpen(response);
        },
        onmessage(msg: EventSourceMessage) {
            const { event, data} = msg;
            try {
                const { id, content_stream } = JSON.parse(data);
                onMessage({
                    id,
                    event,
                    contentStream: content_stream
                });
            } catch (err) {
                throw err;
            }
        },
        onclose() {
            onClose();
        },
        onerror(err) {
            onError(err);
        }
    });
    return {
        abort: ctrl.abort.bind(ctrl)
    }
}