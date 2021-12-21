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

<script lang="js">
export default { }
</script>

<style scoped>
* {
  font-family: sans-serif;
}

#crouton ul {
  margin: 0;
  padding: 0;
  overflow: hidden;
  width: 100%;
  list-style: none;
}

#crouton li {
  float: left;
  margin: 0 10px;
}

#crouton a {
  background: #ddd;
  padding: 0.7em 1em;
  float: left;
  text-decoration: none;
  color: #444;
  text-shadow: 0 1px 0 rgba(255, 255, 255, 0.5);
  position: relative;
}

#crouton li:first-child a {
  border-top-left-radius: 5px;
  border-bottom-left-radius: 5px;
}

#crouton li:last-child a {
  border-top-right-radius: 5px;
  border-bottom-right-radius: 5px;
}

#crouton a:hover {
  background: #99db76;
}

#crouton li:not(:first-child) > a::before {
  content: "";
  position: absolute;
  top: 50%;
  margin-top: -1.5em;
  border-width: 1.5em 0 1.5em 1em;
  border-style: solid;
  border-color: #ddd #ddd #ddd transparent;
  left: -1em;
}

#crouton li:not(:first-child) > a:hover::before {
  border-color: #99db76 #99db76 #99db76 transparent;
}

#crouton li:not(:last-child) > a::after {
  content: "";
  position: absolute;
  top: 50%;
  margin-top: -1.5em;
  border-top: 1.5em solid transparent;
  border-bottom: 1.5em solid transparent;
  border-left: 1em solid #ddd;
  right: -1em;
}

#crouton li:not(:last-child) > a:hover::after {
  border-left-color: #99db76;
}
</style>
