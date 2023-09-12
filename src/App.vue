<script setup lang="ts">
import { ref } from "vue";
import Logo from '@assets/logo-with-text.jpg';
import { fetchTextgen } from "@/api/textgen.ts";
import GsMultiSwitch from "@/components/GsMultiSwitch.vue";

const title = ref('');
const desc = ref('');
const generateContent = ref(``);

const chosenTextgenStyleIndex = ref(0);
const handleSwitch = (idx: number) => {
    chosenTextgenStyleIndex.value = idx;
}
const textgenStyles = ref([
    {
        label: '好评',
        color: '#10b981'
    },
    {
        label: '中立',
        color: '#3b82f6'
    },
    {
        label: '差评',
        color: '#ef4444'
    },
])

const launchTextgenTask = () => {
    fetchTextgen({
        title: title.value,
        brief: desc.value,
        emotion: textgenStyles.value?.[chosenTextgenStyleIndex.value]?.label || '',
    }).then((res) => {
        console.log('gen result', res);
        generateContent.value = res.data;
    });
}
</script>

<template>
    <div class="root"
    >
        <div class="root_left p-4">
            <div class="gs-caption">标题</div>
            <input placeholder="请输入标题" class="gs-input mb-4" :value="title"/>
            <div class="gs-caption">文案风格</div>
            <GsMultiSwitch class="mb-4" :items="textgenStyles" @change="handleSwitch"/>
            <div class="gs-caption">文案简介</div>
            <textarea placeholder="请输入文案简介" class="gs-input mb-4 gs-textarea" :value="desc"/>
            <button class="my-2 gs-button gs-button-primary"
            @click="launchTextgenTask"
            >一键生成</button>
        </div>
        <div class="root_right">
            <div class="logo_head px-4 pt-4">
                <img :src="Logo"/>
            </div>
            <section class="generated_content p-8">
                {{ generateContent }}
            </section>
            <div class="action_bar">
                <div class="action">
                    <span class="gs-icon-wrapper">📄</span>
                    一键复制
                </div>
            </div>
        </div>
    </div>
</template>

<style scoped lang="scss">
@use "@/styles/tool" as tools;

.root {
    height: 100vh;
    overflow: hidden;
    width: 100vw;
    display: flex;

    &_left {
        flex: 0 0 38.2%;
        @include tools.flexColumn;
        justify-content: flex-start;
        @apply bg-slate-100 border-r-2 select-none;
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
</style>
