<template>
    <div class="gs-multi-switch">
        <div :class="['gs-indicator', {
            active: idx === activeItemIdx
        }]"
             :style="{
                ...(item.color && idx === activeItemIdx && { backgroundColor: item.color }),
             }"
             v-for="(item, idx) in items"
             @click="handleItemClick(idx)"
        >{{ item.label }}
        </div>
    </div>
</template>

<script setup lang="ts">
import { ref } from 'vue';

interface GsMultiSwitchItem {
    label: string;
    color?: string;
}

export interface GsMultiSwitchProps {
    items: GsMultiSwitchItem[];
    defaultActiveIdx: number;
}

const emit = defineEmits(['change']);

const props = withDefaults(defineProps<GsMultiSwitchProps>(), {
    items: () => [],
    defaultActiveIdx: 0,
});

// active item index
const activeItemIdx = ref(props.defaultActiveIdx);
const handleItemClick = (idx: number) => {
    activeItemIdx.value = idx;
    emit('change', idx);
}
</script>

<style scoped lang="scss">
$tab_bg_color: rgb(236, 239, 243);
$normal_text_color: rgb(36, 48, 66);
$placeholder_text_color: rgb(36, 48, 66, 0.4);
$desc_text_color: rgba(35, 48, 65, 0.7);
$tab_bg_color: rgb(236, 239, 243);


.gs-multi-switch {
    position: relative;
    display: flex;
    width: fit-content;
    align-items: center;
    padding: 4px;
    border-radius: 10px;
    background: transparent;

    .gs-indicator {
        @apply cursor-pointer;
        padding: 8px 16px; // TODO
        color: $desc_text_color;


        &.active {
            color: #fff;
            //background: $primary_color;
            //color: #fff;
            @apply shadow-lg;
            border-radius: 10px;
            font-weight: 500;
        }
    }

}
</style>