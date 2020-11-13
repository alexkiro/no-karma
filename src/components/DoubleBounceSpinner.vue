<template>
  <v-overlay absolute>
    <div class="spinner">
      <div class="double-bounce1 primary"></div>
      <div class="double-bounce2 primary"></div>
    </div>
  </v-overlay>
</template>

<script>
export default {
  name: "DoubleBounceSpinner",
};
</script>

<style scoped lang="scss">
// See https://github.com/tobiasahlin/SpinKit
.spinner {
  width: 5rem;
  height: 5rem;

  position: relative;
  margin: 12.5rem auto;
}

.double-bounce1,
.double-bounce2 {
  width: 100%;
  height: 100%;
  border-radius: 50%;
  opacity: 0.6;
  position: absolute;
  top: 0;
  left: 0;

  -webkit-animation: sk-bounce 2s infinite ease-in-out;
  animation: sk-bounce 2s infinite ease-in-out;
}

.double-bounce2 {
  -webkit-animation-delay: -1s;
  animation-delay: -1s;
}

@-webkit-keyframes sk-bounce {
  0%,
  100% {
    -webkit-transform: scale(0);
  }
  50% {
    -webkit-transform: scale(1);
  }
}

@keyframes sk-bounce {
  0%,
  100% {
    transform: scale(0);
    -webkit-transform: scale(0);
  }
  50% {
    transform: scale(1);
    -webkit-transform: scale(1);
  }
}
</style>
