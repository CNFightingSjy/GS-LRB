<script setup lang="ts">
import { onBeforeUnmount, onMounted, ref } from "vue";
import { debounce, isFunction } from "lodash-es";
import Logo from '@assets/logo-with-text.jpg';
import { fetchTextgen, TextgenReponseStreamData } from "@/api/textgen.ts";
import GsMultiSwitch from "@/components/GsMultiSwitch.vue";
import { textgenTypes, textgenManners, textgenMannersMap, textgenTemplates } from "@/constants/textgen.ts";
import { TextgenManner, TextgenRequirementDescriptor } from "@/types/textgen.ts";
import { getSessionLevelToken, setSessionLevelToken } from "@/utils/token.ts";
import Typewriter from "typewriter-effect/dist/core";
import copy from 'copy-to-clipboard';

// 控制动画的实例
let typedAnimInstance = null;

// 内容 dom
const typeWriterContentRef = ref(null);

onMounted(() => {
    typedAnimInstance = createNewTypeAnimationInstance(typeWriterContentRef.value)
});
function createNewTypeAnimationInstance(domRef: HTMLElement) {
    return new Typewriter(domRef, {
        cursor: '█',
        delay: 10, // time to add a single char to DOM indicating type speed
        loop: false,
        deleteSpeed: 1,
    });
}

onBeforeUnmount(() => {
    typedAnimInstance = null;
})

enum PageWorkflowStatus {
    Idle,
    Loading,
    Success,
    Error,
}

let workflowStatus = ref<PageWorkflowStatus>(PageWorkflowStatus.Idle);

function initTextgenRequirementDescriptor() {
    return {
        title: '',
        brief: '',
        textType: textgenTypes[0].value,
        textManner: TextgenManner.Positive,
    }
}

const textgenRequirementDescriptor = ref<TextgenRequirementDescriptor>({
    ...initTextgenRequirementDescriptor()
});

const selectedTextgenType = ref(textgenTypes[0].value);
const selectedTextgenMannerIndex = ref(0);

function handleSelectTextgenManner(idx: number) {
    selectedTextgenMannerIndex.value = idx;
    textgenRequirementDescriptor.value.textManner = textgenManners[idx]?.value;
}

function clearAll() {
    textgenRequirementDescriptor.value = {
        ...initTextgenRequirementDescriptor()
    };
    clearDisplayedGenText();
    workflowStatus.value = PageWorkflowStatus.Idle;
}

/**
 * Consumer Token Validation
 */
const consumerToken = ref('')
const showValidConsumerTokenModal = ref(false);

function validateConsumerToken() {
    if (!consumerToken.value) {
        // TODO: 提示
        return;
    }
    setSessionLevelToken(consumerToken.value);
    showValidConsumerTokenModal.value = false;
}

function openModal() {
    consumerToken.value = '';
    showValidConsumerTokenModal.value = true;
}

function clearDisplayedGenText() {
    if (!typeWriterContentRef.value) {
        return;
    }
    const typeWriterWrapperDOM = typeWriterContentRef.value.querySelector('.Typewriter__wrapper');
    if (typeWriterWrapperDOM && typeWriterWrapperDOM.innerHTML) {
        typeWriterWrapperDOM.innerHTML = '';
    }
}


// 当前任务的中断函数
let currentTaskAbort = null;

// debounce 500ms
const launchTextgenTask = debounce(() => {
    const token = getSessionLevelToken();
    if (!token) {
        openModal();
        return;
    }
    if (!textgenRequirementDescriptor.value.title) {
        showModalWithMsg('请输入标题');
        return;
    }
    workflowStatus.value = PageWorkflowStatus.Loading;
    clearDisplayedGenText();
    const stream = [];
    const { abort } = fetchTextgen({
        title: textgenRequirementDescriptor.value.title || '',
        brief: textgenRequirementDescriptor.value.brief || '',
        emotion: textgenManners?.[selectedTextgenMannerIndex.value]?.value || '',
        type: selectedTextgenType.value || '',
        token: token || '',
    }, {
        onOpen: () => {
            console.log('open');
        },
        onError: (e) => {
            console.log('error', e);
        },
        onClose: () => {
            console.log('close');
            workflowStatus.value = PageWorkflowStatus.Success;
        },
        onMessage: (msg: TextgenReponseStreamData) => {
            // @ts-ignore
            const { id, event, contentStream } = msg;
            if (contentStream.includes('[DONE]')) {
                return;
            }
            typedAnimInstance.typeString(contentStream).start();
        },
    });
    currentTaskAbort = abort;
}, 500);

const abortTextgenProcess = () => {
    if (!currentTaskAbort) {
        throw new Error('No current task to abort');
    }
    isFunction(currentTaskAbort) && currentTaskAbort();
    typedAnimInstance.stop();
    clearDisplayedGenText();
    workflowStatus.value = PageWorkflowStatus.Idle;
}

function copyGeneratedText() {
    //  copy dom's innerHTML
    let copyed = '';
    if (typeWriterContentRef.value) {
        const typeWriterWrapperDOM = typeWriterContentRef.value.querySelector('.Typewriter__wrapper');
        if (typeWriterWrapperDOM && typeWriterWrapperDOM.innerHTML) {
            copyed = typeWriterWrapperDOM.innerHTML;
        }
    }
    copy(copyed);
}
function fillTemplate(template) {
    const { title, brief, textType: textTypeObj, textManner: textMannerObj } = template;
    handleSelectTextgenManner(textgenManners.findIndex((item) => item.value === textMannerObj.value));
    selectedTextgenType.value = textTypeObj.value;
    textgenRequirementDescriptor.value = {
        title,
        brief,
        textType: textTypeObj.value,
        textManner: textMannerObj.value,
    }
}

const showNormalModal = ref(false);
const modalMsg = ref('');
function showModalWithMsg(msg: string) {
    showNormalModal.value = true;
    modalMsg.value = msg;
}
function closeMsgModal() {
    showNormalModal.value = false;
    modalMsg.value = '';
}
</script>

<template>
    <div class="root">
        <!--    左边    -->

        <dialog class="modal" :class="{
                'modal-open': !!showNormalModal
            }">
            <div class="modal-box">
                <h3 class="font-bold text-lg">Tips</h3>
                <p class="py-4">{{ modalMsg }}</p>
                <div class="modal-action">
                    <form method="dialog">
                        <button class="btn" @click="closeMsgModal">知道了</button>
                    </form>
                </div>
            </div>
        </dialog>

        <!-- 填激活码的 modal -->
        <dialog class="modal backdrop-blur-lg" :class="{
                'modal-open': !!showValidConsumerTokenModal
            }">
            <div class="modal-box">
                <h3 class="font-bold text-lg">输入邀请码，开启使用权限</h3>
                <input placeholder="请输入邀请码" class="input input-bordered w-full mt-4" v-model="consumerToken"
                       @keyup.enter="validateConsumerToken"
                />
                <div class="modal-action">
                    <form method="dialog">
                        <button class="btn btn-primary" @click="validateConsumerToken"
                        >确认</button>
                    </form>
                </div>
            </div>
        </dialog>

        <div class="root_left p-4">
            <div class="flex flex-col border-b border-dashed border-slate-300 pb-4 mb-4 items-center">
                <div class="font-serif font-bold text-xl pb-1 text-slate-800">小文案助手</div>
                <div class="font-serif text-sm text-slate-400">由 GS-LLM 驱动</div>
            </div>

            <div class="gs-caption">标题</div>
            <input placeholder="请输入标题" class="input input-bordered w-full" v-model="textgenRequirementDescriptor.title"/>

            <div class="gs-caption mt-4">文案态度</div>
            <GsMultiSwitch class="" :items="textgenManners" @change="handleSelectTextgenManner"/>

            <div class="gs-caption mt-4">文案类型</div>
            <select class="select select-bordered w-full" v-model="selectedTextgenType">
                <option v-for="(type, idx) in textgenTypes" :key="idx" :value="type.value">{{ type.name }}</option>
            </select>

            <div class="gs-caption mt-4">产品简介(Brief)</div>
            <textarea
                    v-model="textgenRequirementDescriptor.brief"
                    class="textarea textarea-bordered w-full"
                    rows="4"
                    type="text" placeholder="请输入文案简介"
            />

            <div v-if="workflowStatus === PageWorkflowStatus.Loading" class="flex w-full gap-2 mt-4">
<!--                <button class=" grow btn btn-error my-2" @click="abortTextgenProcess">-->
<!--                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor"-->
<!--                         class="bi bi-x-lg" viewBox="0 0 16 16">-->
<!--                        <path d="M2.146 2.854a.5.5 0 1 1 .708-.708L8 7.293l5.146-5.147a.5.5 0 0 1 .708.708L8.707 8l5.147 5.146a.5.5 0 0 1-.708.708L8 8.707l-5.146 5.147a.5.5 0 0 1-.708-.708L7.293 8 2.146 2.854Z"/>-->
<!--                    </svg>-->
<!--                    终止生成-->
<!--                </button>-->
                <button class="btn-disabled w-full btn btn-primary my-2">
                    <span class="loading loading-spinner"></span>
                    加载中
                </button>
            </div>
            <div v-else class="flex w-full gap-2 mt-4">
                <button class=" grow btn btn-neutral btn-outline my-2" @click="clearAll">
                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor"
                         class="bi bi-x-lg" viewBox="0 0 16 16">
                        <path d="M2.146 2.854a.5.5 0 1 1 .708-.708L8 7.293l5.146-5.147a.5.5 0 0 1 .708.708L8.707 8l5.147 5.146a.5.5 0 0 1-.708.708L8 8.707l-5.146 5.147a.5.5 0 0 1-.708-.708L7.293 8 2.146 2.854Z"/>
                    </svg>
                    一键清空
                </button>
                <button class=" basis-1/2 btn btn-primary my-2"
                        @click="launchTextgenTask">
                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor"
                         class="bi bi-feather" viewBox="0 0 16 16">
                        <path d="M15.807.531c-.174-.177-.41-.289-.64-.363a3.765 3.765 0 0 0-.833-.15c-.62-.049-1.394 0-2.252.175C10.365.545 8.264 1.415 6.315 3.1c-1.95 1.686-3.168 3.724-3.758 5.423-.294.847-.44 1.634-.429 2.268.005.316.05.62.154.88.017.04.035.082.056.122A68.362 68.362 0 0 0 .08 15.198a.528.528 0 0 0 .157.72.504.504 0 0 0 .705-.16 67.606 67.606 0 0 1 2.158-3.26c.285.141.616.195.958.182.513-.02 1.098-.188 1.723-.49 1.25-.605 2.744-1.787 4.303-3.642l1.518-1.55a.528.528 0 0 0 0-.739l-.729-.744 1.311.209a.504.504 0 0 0 .443-.15c.222-.23.444-.46.663-.684.663-.68 1.292-1.325 1.763-1.892.314-.378.585-.752.754-1.107.163-.345.278-.773.112-1.188a.524.524 0 0 0-.112-.172ZM3.733 11.62C5.385 9.374 7.24 7.215 9.309 5.394l1.21 1.234-1.171 1.196a.526.526 0 0 0-.027.03c-1.5 1.789-2.891 2.867-3.977 3.393-.544.263-.99.378-1.324.39a1.282 1.282 0 0 1-.287-.018Zm6.769-7.22c1.31-1.028 2.7-1.914 4.172-2.6a6.85 6.85 0 0 1-.4.523c-.442.533-1.028 1.134-1.681 1.804l-.51.524-1.581-.25Zm3.346-3.357C9.594 3.147 6.045 6.8 3.149 10.678c.007-.464.121-1.086.37-1.806.533-1.535 1.65-3.415 3.455-4.976 1.807-1.561 3.746-2.36 5.31-2.68a7.97 7.97 0 0 1 1.564-.173Z"/>
                    </svg>
                    一键生成
                </button>
            </div>

            <div class="gs-caption mt-4">使用模板快速填充</div>
            <div class="flex flex-wrap gap-3">
                <div
                    v-for="(template, idx) in textgenTemplates"
                    class="template-option  p-2"
                    @click="fillTemplate(template)"
                >
                    <div class="template-option_title">{{ template.title }}</div>
                    <div class="template-option_emotion">
                        <div class="badge text-white border-none" :style="{
                            backgroundColor: template.textManner.color
                        }">{{ template.textManner.label }}</div>
                    </div>
                    <div class="template-option_desc">我的早C晚A护肤肤搭配肌肤修复肤搭配肌肤修复肤搭配肌肤修肤搭配肌肤修复肤搭配肌肤修复复搭配肌肤修复研究超过10年 独家科技离子技术 包含6大植物成分～</div>
                </div>
            </div>
            <footer class="gs-footer">
                商务合作：zhanglin@symbioticmatrix.com
            </footer>
        </div>

        <!--    右边    -->
        <div class="root_right">
            <div class="logo_head px-4 pt-4">
                <img :src="Logo"/>
            </div>
            <section id="generated_content" class="generated_content p-8">
                <pre ref="typeWriterContentRef" :style="{
                    textWrap: 'wrap'
                }">
                </pre>
            </section>
            <div class="action_bar">
                <div class="action" @click="copyGeneratedText">
                    <span class="gs-icon-wrapper">📄</span>
                    一键复制
                </div>
            </div>
        </div>
    </div>
</template>

<style scoped lang="scss">
@use "@/styles/tool" as tools;

$zIndexLevelI: 110;
$zIndexLevelII: 220;
$zIndexLevelIII: 330;

.fullscreen-mask {
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    z-index: $zIndexLevelIII;
    background: rgba(0, 0, 0, 0.2);
    backdrop-filter: blur(50px);
}

.root {
    height: 100vh;
    overflow: hidden;
    width: 100vw;
    display: flex;

    &_left {
        flex: 0 0 38.2%;
        @apply bg-slate-100 border-r-2;
        overflow-y: auto;
        position: relative;
    }

    &_right {
        flex: 0 0 61.8%;
        @include tools.flexColumn;
        @apply text-slate-700;
        position: relative;

        .logo_head {
            @apply flex justify-end select-none
            border-b;
            img {
                height: 60px;
                width: auto;
                object-fit: cover;
            }
        }
    }

}

.gs-footer {
    //position: absolute;
    //bottom: 12px;
    //right: 12px;
    @apply mt-4
    text-slate-400 text-sm;

}

.generated_content {
    @apply pb-32;
    font-family: serif;
    font-size: 20px;
    overflow-y: auto;
    line-height: 30px;
}

@mixin boxShadowTopOnly {
    box-shadow: 0 -5px 40px -20px rgba(0, 0, 0, 0.5);
}

.action_bar {
    @apply border-t-2 bg-white
    hover:bg-slate-100
    transition-colors
    select-none;
    @include boxShadowTopOnly;
    cursor: pointer;
    height: 60px;
    position: absolute;
    left: 0;
    right: 0;
    bottom: 0;

    .action {
        font-weight: bold;
        width: 100%;
        height: 100%;
        @apply flex items-center justify-center text-slate-800 text-lg;
    }
}
.template-option {
   @apply bg-white rounded-lg cursor-pointer
   border-2 border-transparent border-dashed border-slate-300
   hover:-translate-y-1 hover:shadow-md

   flex flex-col grow-0 shrink;

    width: 42%;

    min-height: 120px;
    transition: all .2s;

    &_title {
        @apply font-bold
        text-ellipsis whitespace-nowrap overflow-hidden;
    }
    &_emotion {
    }
    &_desc {
        @apply text-slate-400 text-xs mt-1
        text-ellipsis overflow-hidden;
        height: 50px;
    }
}
</style>
