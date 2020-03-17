<template>
  <section class="section is-desktop">
    <div class="container">
      <div class="columns">
        <fieldset class="fieldset box">
          <legend class="label"></legend>
          <transition name="fade">
            <p  id="validationError" class="content" v-if="requiredFieldErrors.length">
              <b class="info" v-if="requiredFieldErrors.length <= 1">Please correct following error</b>    
              <b class="info" v-else>Please correct following errors</b>
            <ul>
              <li
                v-for="requiredFieldError in requiredFieldErrors"
                v-bind:key="requiredFieldError"
              >
                {{ requiredFieldError }}
              </li>
            </ul>
            </p>
          </transition>
          <div class="field columns is-desktop first-row">
            <div class="field column is-three-fifths">
              <p class="control has-icons-left">
                <!-- {{isSearchStringValid}}
                {{actualSearchString}}-->
                <input
                  id="searchString"
                  class="input search-city"
                  type="text"
                  placeholder="Street address or zip code"
                  v-model="search_string"
                />
                <span class="icon is-small is-left">
                  <i class="fas fa-globe-americas"></i>
                </span>
              </p>
            </div>

            <div class="field column">
              <!-- {{isSearchRadiusValid}} -->
              <p class="control">
                <input
                  id="searchRadius"
                  class="input"
                  type="number"
                  placeholder="Miles"
                  min="0"
                  v-model="search_radius"
                />
              </p>
            </div>

            <div class="field column" @click="submitServerRequest()">
              <p class="control">
                <a class="button">Submit</a>
              </p>
            </div>
          </div>

          <transition name="fade">
            <!-- result box -->
            <div
              class="columns second-row"
              v-if="search_results !== null && households > 20 && requiredFieldErrors.length <= 0"
            >
              <div class="label result-text">
                <div class="column">
                  <label>Result:</label>
                </div>
              </div>

              <div class="column">
                <div class="box result-box">
                  <!-- Success 200 response -->
                  <p>Household: {{ households }}</p>
                  <p>Individuals: {{ individual }}</p>
                </div>
              </div>
            </div>
          </transition>
          <transition name="fade">
            <div
              class="has-text-danger"
              v-if="isError == true && responseStatus >= 200 && responseStatus < 500 && requiredFieldErrors.length <= 0"
            >
              <i class="fas fa-exclamation-triangle"></i>
              {{ errorMessage }}
            </div>

            <div
              class="has-text-danger"
              v-if="isError == true && responseStatus == 500 && requiredFieldErrors.length <= 0"
            >
              <i class="fas fa-exclamation-circle"></i>
              {{ errorMessage }}
            </div>
          </transition>
        </fieldset>
      </div>
    </div>
  </section>
</template>

<script>
export default {
  name: "member-targeting",
  data() {
    return {
      search_string: "",
      search_radius: "",
      search_results: null,
      households: null,
      individual: null,
      requiredFieldErrors: [],
      errorMessage:
        "  Sorry, we couldn't process your request. Please try again",
      responseStatus: null,
      isError: false
    };
  },
  props: {
    $axios: {
      // validating 'props'
      type: [Function, Object],
      required: true
    },
    url: {
      type: String,
      required: true
    },
    search_string_prop: {
      type: String,
      required: false,
      default: null
    },
    search_radius_prop: {
      type: [Number, String],
      required: false,
      default: null
    }
  },
  methods: {
    // my components
    // submitServerRequest(){
    //   this.$emit('submit-result')
    // }
    // // Parent component:
    // :submit-result="submit-result"
    // methods: {
    //   submit-result(){
    //   }
    // }

    submitServerRequest() {
      // sending HTTP calls to the server
      this.requiredFieldErrors = [];
      if (this.isSearchStringValid && this.isSearchRadiusValid) {
        let axiosPayload = {
          // sending this payload to the service via $axios call / discuss with Graham if it has been formatted correctly
          search_string: this.actualSearchString,
          search_radius: this.search_radius
        };
        this.$axios // my component is making $axios calls to service
          .post(this.url, axiosPayload)
          .then(response => {
            this.responseStatus = response.status; // saving HTTP status
            // console.log(response);
            this.search_results = response.data; // success 200 response
            // console.log(response.data);
            if (response.data.results.msg) {
              this.isError = true;
              this.errorMessage = response.data.results.msg; // min threshold 200 response
              console.log(this.errorMessage);
            } else {
              this.households = response.data.results.households.count;
              this.individual = response.data.results.individual.count;
              console.log("things went well success");
            }
            this.$emit("submit-result", response); // emitting to my parent component so that it just knows what is happening
          })
          .catch(error => {
            this.isError = true;
            this.responseStatus = error.response.status; // saving HTTP status
            if (error.response.data.msg) {
              this.errorMessage = error.response.data.msg;
            }
            this.$emit("submit-result", error); // emitting to my parent component so that it knows what is happening
          });
        console.log("trying to emit ...");
      } else {
        if (!this.isSearchStringValid)
          this.requiredFieldErrors.push("No Location chosen");
        if (!this.isSearchRadiusValid)
          this.requiredFieldErrors.push("No Miles chosen");
      }
    }
  },
  computed: {
    isSearchStringValid: function() {
      if (this.actualSearchString.length > 0) {
        return true;
      }
      return false;
    },
    actualSearchString: function() {
      return this.search_string.trim();
    },
    isSearchRadiusValid: function() {
      if (this.search_radius >= 0 && this.search_radius.length > 0) {
        return true;
      }
      return false;
    }
  },
  created: function() {
    if (this.search_string_prop !== null) {
      this.search_string = this.search_string_prop;
    }
    if (this.search_radius_prop !== null) {
      this.search_radius = this.search_radius_prop;
    }
  }
};
</script> 

<style>
@import "../assets/targeting.css";

/* Animation: form validation error messages, the result box, and server error messages */
.fade-enter {
  opacity: 0;
}
.fade-enter-active {
  transition: opacity 0.25s cubic-bezier(0.42, 0, 0.58, 1); /*ease-in-out*/
}

.fade-leave-to {
  opacity: 0;
}

.fade-leave-active {
  transition: opacity 0.5s cubic-bezier(0.25, 0.1, 0.25, 0.25); /*ease*/
}
</style>




