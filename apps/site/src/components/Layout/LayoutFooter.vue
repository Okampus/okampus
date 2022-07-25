<template>
    <footer class="mt-8 mb-6 flex flex-col gap-6 xs:mx-20 sm:mx-auto xs-max:mx-10">
        <!-- Copyright -->
        <div class="text-0 flex items-center justify-center">
            <div class="flex flex-col items-center gap-2 xs:flex-row">
                <p>Made with</p>
                <i class="fas fa-heart transition-transform hover:scale-125 hover:text-red-500" />
                <p>by Okampus</p>
                <div class="flex items-center gap-1">
                    <i class="far fa-copyright text-sm" />
                    <p>{{ new Date().getFullYear() }}</p>
                </div>
            </div>
        </div>
    </footer>
</template>

<style lang="scss">
    .hover-icon {
        background: transparent;
        transition: transform 0.2s ease-in-out;

        &:hover {
            transform: scale(1.2);

            .dark & {
                text-shadow: 0 0 15px #fff;
            }
        }
    }
</style>
