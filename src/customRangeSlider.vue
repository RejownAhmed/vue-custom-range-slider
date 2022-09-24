<template>
    <div 
        :id="props.id"
        class="range-container"
        :class="props.expandOnHover ? 'expandOnHover' : ''"
        :style="{   
            '--progress-position': position, 
            '--range-container-height': props.rangeContainerHeight, 
            '--range-height': props.rangeHeight, 
            '--thumb-height': props.thumbHeight, 
            '--range-bg-color': props.rangeBgColor, 
            '--thumb-color': props.thumbColor, 
            '--preview-color': props.previewColor, 
            '--progress-color': props.progressColor, 
        }">
        <div class="range">
            <span v-if="!props.noPreviewBar" class="preview"></span>
            <span v-if="!props.noProgressBar" class="progress"></span>
            <slot></slot>
            <span v-if="!props.noThumb" class="thumb-indicator" :style="props.alwaysShowThumb ? {display: 'block'} : ''"></span>
        </div>
    </div>
  </template>
  <script setup>
    import { onMounted, ref } from 'vue'
    
    const props = defineProps(
        {
            modelValue: {
                type: String,
                default: '0'
            },
            id: {
                type: String,
                required: true,
            },
            defaultPosition: {
                type: Number,
                default: 0
            },
            alwaysShowThumb: {
                type: Boolean,
                default: false
            },
            noPreviewBar: {
                type: Boolean,
                default: false
            },
            noProgressBar: {
                type: Boolean,
                default: false
            },
            noThumb: {
                type: Boolean,
                default: false
            },
            expandOnHover: {
                type: Boolean,
                default: false
            },
            rangeContainerHeight: {
                type: String,
                default: '7px'
            },
            rangeHeight: {
                type: String,
                default: '3px'
            },
            thumbHeight: {
                type: String,
                default: '200%'
            },
            rangeBgColor: {
                type: String,
                default: 'rgba(100, 100, 100, .5)'
            },
            thumbColor: {
                type: String,
                default: 'red'
            },
            previewColor: {
                type: String,
                default: 'rgb(150, 150, 150)'
            },
            progressColor: {
                type: String,
                default: 'red'
            },
        }
    )
    const emit  = defineEmits([
        'update:modelValue'
    ])
    const position = ref(props.defaultPosition)
    const isScrubbing = ref(false)
    const rangeContainer = ref()
  
    onMounted(()=>{
        rangeContainer.value = document.getElementById(props.id)
        customRange()
    })
  
    const customRange = ()=>{
        rangeContainer.value.addEventListener("mousemove", handlerangeUpdate)
        rangeContainer.value.addEventListener("mousedown", toggleScrubbing)
        document.addEventListener("mouseup", e => {
            if (isScrubbing.value) toggleScrubbing(e)
        })
        document.addEventListener("mousemove", e => {
            if (isScrubbing.value) handlerangeUpdate(e)
        })
  
    }
    const toggleScrubbing = (e)=> {
        isScrubbing.value = (e.buttons & 1) === 1
        handlerangeUpdate(e)
    }
    const handlerangeUpdate = (e)=>{
        const rect = rangeContainer.value.getBoundingClientRect()
        const percent = Math.min(Math.max(0, e.x - rect.x), rect.width) / rect.width
        rangeContainer.value.style.setProperty("--preview-position", percent)
        if (isScrubbing.value) {
            rangeContainer.value.style.setProperty("--progress-position", percent)
            position.value = percent;
            emit('update:modelValue', percent.toString())
        }
    }
  
  </script>
  <style lang="scss" scoped> 
    .range-container {
        --range-container-height: 7px;
        --range-height: 3px;
        --hover-range-height: var(--range-height);
        --thumb-height: 200%;
        --range-bg-color: rgba(100, 100, 100, .5);
        --thumb-color: red;
        --preview-color: rgb(150, 150, 150);
        --progress-color: red;
        &.expandOnHover{
            --hover-range-height: 100%;
        }
        height: var(--range-container-height);
        margin-inline: .5rem;
        cursor: pointer;
        display: flex;
        align-items: center;
        .range {
            background-color: var(--range-bg-color);
            height: var(--range-height);
            width: 100%;
            position: relative;
            .preview {
                content: "";
                position: absolute;
                left: 0;
                top: 0;
                bottom: 0;
                height: 100%;
                right: calc(100% - var(--preview-position) * 100%);
                background-color: var(--preview-color);
                display: none;
            }
            .progress {
                content: "";
                position: absolute;
                left: 0;
                top: 0;
                bottom: 0;
                height: 100%;
                right: calc(100% - var(--progress-position) * 100%);
                background-color: var(--progress-color);
            }
            .thumb-indicator{
                display: none;
                position: absolute;
                transform: translate(-50%, -50%) scale(1);
                height: var(--thumb-height);
                top: 50%;
                left: calc(var(--progress-position) * 100%);
                background-color: var(--thumb-color);
                border-radius: 50%;
                transition: transform 150ms ease-in-out;
                aspect-ratio: 1 / 1;
                z-index: 1080;
            }
        }
        &:hover{
            .range {
                height: var(--hover-range-height);
            }
            .range .preview {
                display: block;
            }
            .thumb-indicator {
                display: block !important;
            }
            
        } 
    }
  </style>
  