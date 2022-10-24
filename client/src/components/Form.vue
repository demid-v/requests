<script setup lang="ts">
function showJson(e: Event) {
  const data = new FormData(e.currentTarget as HTMLFormElement);
  console.log(Array.from(data.entries()));
  console.log(data);

  fetch("http://localhost:5501/form-config", {
    method: "POST",
    body: data,
  })
    .then(async (res) => {
      const d = await res.json();
      console.log(d);
    })
    .catch((e) => console.error(e));
}
</script>

<template>
  <form @submit.prevent="showJson">
    <fieldset>
      <legend>Order's information</legend>

      <label for="name">Name</label><br />
      <input type="text" id="name" name="name" value="Order 1" required /><br />

      <label for="description">Description</label><br />
      <textarea id="description" name="description" required>
Lorem ipsum dolor sit amet consectetur adipisicing elit. Deleniti, quae.</textarea
      ><br />

      <label for="datetime">Order's date</label><br />
      <input id="datetime" name="datetime" type="datetime-local" required />
      <br />

      <label for="options">Select an option</label><br />
      <select id="options" name="options">
        <option value="1">1</option>
        <option value="2" selected>2</option>
        <option value="3">3</option></select
      ><br />

      <input type="submit" value="Confirm" />
    </fieldset>
  </form>
</template>

<style scoped></style>
