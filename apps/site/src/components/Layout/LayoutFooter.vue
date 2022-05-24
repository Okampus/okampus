<template>
    <footer class="flex flex-col gap-6 mt-8 mb-6 xs:mx-20 sm:mx-auto xs-max:mx-10">
        <!-- Copyright -->
        <div class="flex justify-center items-center text-0">
            <div class="flex flex-col gap-2 items-center xs:flex-row">
                <p>Made with</p>
                <i class="hover:text-red-500 transition-transform hover:scale-125 fas fa-heart" />
                <p>by Okampus</p>
                <div class="flex gap-1 items-center">
                    <i class="text-sm far fa-copyright" />
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
