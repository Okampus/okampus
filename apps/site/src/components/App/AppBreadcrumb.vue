<template>
    <div id="crouton">
        <ul>
            <li><a href="#">One</a></li>
            <li><a href="#">Two</a></li>
            <li><a href="#">Three</a></li>
            <li><a href="#">Four</a></li>
        </ul>
    </div>
</template>

<script>
    export default {}
</script>

<style scoped>
    * {
        font-family: sans-serif;
    }

    #crouton ul {
        width: 100%;
        padding: 0;
        margin: 0;
        overflow: hidden;
        list-style: none;
    }

    #crouton li {
        float: left;
        margin: 0 10px;
    }

    #crouton a {
        position: relative;
        float: left;
        padding: 0.7em 1em;
        color: #444;
        text-decoration: none;
        text-shadow: 0 1px 0 rgb(255 255 255 / 50%);
        background: #ddd;
    }

    #crouton li:first-child a {
        border-top-left-radius: 5px;
        border-bottom-left-radius: 5px;
    }

    #crouton li:last-child a {
        border-top-right-radius: 5px;
        border-bottom-right-radius: 5px;
    }

    #crouton li:not(:first-child) > a::before {
        position: absolute;
        top: 50%;
        left: -1em;
        margin-top: -1.5em;
        content: '';
        border-color: #ddd #ddd #ddd transparent;
        border-style: solid;
        border-width: 1.5em 0 1.5em 1em;
    }

    #crouton li:not(:first-child) > a:hover::before {
        border-color: #99db76 #99db76 #99db76 transparent;
    }

    #crouton li:not(:last-child) > a::after {
        position: absolute;
        top: 50%;
        right: -1em;
        margin-top: -1.5em;
        content: '';
        border-top: 1.5em solid transparent;
        border-bottom: 1.5em solid transparent;
        border-left: 1em solid #ddd;
    }

    #crouton li:not(:last-child) > a:hover::after {
        border-left-color: #99db76;
    }
</style>
