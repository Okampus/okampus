<template>
    <div class="group card-0 flex flex-col">
        <div
            class="handle -mt-2 flex h-4 w-full cursor-move justify-center opacity-0 transition-opacity group-hover:opacity-100"
        >
            <i class="text-3 fa fa-grip" />
        </div>

        <slot />
    </div>
</template>
