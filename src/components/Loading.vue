<template>
  <div class="loading-layer">
    <div class="lds-ring">
      <div></div>
      <div></div>
      <div></div>
      <div></div>
    </div>
  </div>
</template>

<script>
export default {
  name: "Loading",
};
</script>

<style scoped>
/* See https://loading.io/css/ */
.lds-ring {
  display: inline-block;
  position: relative;
  width: 5.5rem;
  height: 5.5rem;
}

.lds-ring div {
  box-sizing: border-box;
  display: block;
  position: absolute;
  width: 4.5rem;
  height: 4.5rem;
  margin: 0.75rem;
  border: 0.75rem solid;
  border-radius: 50%;
  animation: lds-ring 1.2s cubic-bezier(0.5, 0, 0.5, 1) infinite;
  border-color: var(--v-primary-base) transparent transparent transparent;
}

.lds-ring div:nth-child(1) {
  animation-delay: -0.45s;
}

.lds-ring div:nth-child(2) {
  animation-delay: -0.3s;
}

.lds-ring div:nth-child(3) {
  animation-delay: -0.15s;
}

@keyframes lds-ring {
  0% {
    transform: rotate(0deg);
  }
  100% {
    transform: rotate(360deg);
  }
}
</style>
