<template>
    <div
        class="flex items-center w-full p-2 px-4 gap-4 rounded-b-lg"
        :class="[!background ? 'alert' : 'alert-bg']"
        :alert-type="type"
    >
        <div class="title flex items-center">
            <div
                v-if="$slots.icon"
                class="flex items-center"
            >
                <slot name="icon" />
            </div>

            <div
                v-else-if="icon"
                class="flex items-center"
            >
                <font-awesome-icon
                    :icon="defaultIconList?.[type]"
                />
            </div>
        </div>

        <div class="flex-grow">
            <slot name="text" />
        </div>
    </div>
</template>

<script>
export default {
    props:{
        background:{
            type: Boolean,
            default:()=>false
        },
        icon:{
            type:Boolean,
            default:()=>true
        },
        type:{
            type:String,
            required:true,
            default:()=>'info'
        },

    },
    data() {
        return {
            defaultIconList:{
                info:'info',
                warning:'exclamation',
                error:'times',
                success:'check',
            }
        }
    },
}
</script>

<style lang="scss">
%alert, .alert {
    &[alert-type="info"] {
        .title {
            @apply text-blue-600 dark:text-blue-500;
        }

        .subtitle {
            @apply text-blue-500 dark:text-blue-400;
        }
    }

    &[alert-type="warning"] {
        .title {
            @apply text-yellow-600 dark:text-yellow-500;
        }

        .subtitle {
            @apply text-yellow-500 dark:text-yellow-400;
        }
    }

    &[alert-type="error"] {
        .title {
            @apply text-red-600 dark:text-red-500;
        }

        .subtitle {
            @apply text-red-500 dark:text-red-400;
        }
    }

    &[alert-type="success"] {
        .title {
            @apply text-green-600 dark:text-green-500;
        }

        .subtitle {
            @apply text-green-500 dark:text-green-400;
        }
    }
}

.alert-bg {
    @extend %alert;
    @apply border-t-2;
    &[alert-type="info"] {
        @apply bg-blue-100 dark:bg-blue-800/50 border-blue-500;
    }

    &[alert-type="warning"] {
        @apply bg-yellow-100 dark:bg-yellow-800/50 border-yellow-500;
    }

    &[alert-type="error"] {
        @apply bg-red-100 dark:bg-red-800/50 border-red-500;
    }

    &[alert-type="success"] {
        @apply bg-green-100 dark:bg-green-800 border-green-500;
    }
}

</style>
