import "bulma/css/bulma.css";
import "@fortawesome/fontawesome-free/css/all.css";
import { storiesOf } from "@storybook/vue";
import Targeting from "../components/Targeting.vue";

// storiesOf("Targeting/Targeting", module).add("targeting", () => ({
// 	name: "member-targeting",
// 	components: { Targeting },
// 	template: `<Targeting></Targeting>`
// }));

// setup axios mock scaffolding
import axios from "axios";
import MockAdapter from "axios-mock-adapter";
const mock = new MockAdapter(axios);

// setup mocked request/responses
// SUCCESS
const MEMBER_TARGETING_URL_SUCCESS = "https://member_targeting_service/success";
mock.onPost(MEMBER_TARGETING_URL_SUCCESS).reply(200, {
	elapsed: 1.3594481945037842,
	query_payload: {
		AND: [
			{
				type: "geo",
				meta: {
					function: "radialDistanceFromTextLocation",
					payload: {
						search_string: "Gresham, OR",
						units: "miles",
						distance: 10
					}
				}
			}
		]
	},
	results: {
		households: {
			count: 42
		},
		individual: {
			count: 101
		}
	}
});

// SUCCESS: But minimum threshold not met
const MEMBER_TARGETING_URL_SUCCESS_MIN_THRESHOLD = "https://member_targeting_service/success_min_threshold";
mock.onPost(MEMBER_TARGETING_URL_SUCCESS_MIN_THRESHOLD).reply(200, {
	elapsed: 4.896696090698242,
	query_payload: {
		AND: [
			{
				meta: {
					function: "radialDistanceFromTextLocation",
					payload: {
						distance: 1,
						search_string: "gresham, or",
						units: "miles"
					}
				},
				type: "geo"
			}
		]
	},
	results: {
		// " Minimum number of households, 20, not met by combination of query filters. Please try again."
		msg: " Required minimum number of households 20. Please try again"
	}
});

// SUCCESS:  Random Error
const MEMBER_TARGETING_URL_SUCCESS_RANDOM_ERROR = "https://member_targeting_service/success_random_error";
mock.onPost(MEMBER_TARGETING_URL_SUCCESS_RANDOM_ERROR).reply(200, {
	elapsed: 4.896696090698242,
	query_payload: {
		AND: [
			{
				meta: {
					function: "radialDistanceFromTextLocation",
					payload: {
						distance: 1,
						search_string: "gresham, or",
						units: "miles"
					}
				},
				type: "geo"
			}
		]
	},
	results: {
		msg: " Sorry, couldn't process your request.  Please try again"
	}
});

// ERROR: Server 500
const MEMBER_TARGETING_URL_ERROR_SERVER_500 = "https://member_targeting_service/error_server_500";
mock.onPost(MEMBER_TARGETING_URL_ERROR_SERVER_500).reply(500, {
	msg: " Internal server error happened. Please try again"
});

// ERROR: Server 403
const MEMBER_TARGETING_URL_ERROR403 = " https://member_targeting_service/error_server_403";
mock.onPost(MEMBER_TARGETING_URL_ERROR403).reply(403, { message: "a server side 403 error just happened" });

// ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~ //

// storiesOf('Demonstration/AxiosMocking', module)
storiesOf("Targeting/Targeting", module)
	// SUCCESS
	.add(
		"Member Targeting: Success",
		() => ({
			components: {
				Targeting
			},
			template: `<Targeting :url="MEMBER_TARGETING_URL_SUCCESS" :$axios="axios"></Targeting>`,
			data: () => ({
				MEMBER_TARGETING_URL_SUCCESS: MEMBER_TARGETING_URL_SUCCESS,
				axios: axios
			})
		}),
		{
			info: {
				summary: `This simulates a SUCCESSFUL Axios HTTP call to the Member Targeting service`
			}
		}
	)
	// SUCCESS: But minimum threshold not met
	.add(
		"Member Targeting: Minimum Threshold not met",
		() => ({
			components: {
				Targeting
			},
			template: `<Targeting :url="MEMBER_TARGETING_URL_SUCCESS_MIN_THRESHOLD" :$axios="axios"></Targeting>`,
			data: () => ({
				MEMBER_TARGETING_URL_SUCCESS_MIN_THRESHOLD: MEMBER_TARGETING_URL_SUCCESS_MIN_THRESHOLD,
				axios: axios
			})
		}),
		{
			info: {
				summary: `This simulates a SUCCESSFUL Axios HTTP call to the Member Targeting service, but the Minimum Threshold is not met`
			}
		}
	)
	// ERROR: Server 500
	.add(
		"Member Targeting: Error, server 500",
		() => ({
			components: {
				Targeting
			},
			template: `<Targeting :url="MEMBER_TARGETING_URL_ERROR_SERVER_500" :$axios="axios"></Targeting>`,
			data: () => ({
				MEMBER_TARGETING_URL_ERROR_SERVER_500: MEMBER_TARGETING_URL_ERROR_SERVER_500,
				axios: axios
			})
		}),
		{
			info: {
				summary: `This simulates a server-side 500 ERROR Axios HTTP call to the Member Targeting service`
			}
		}
	)
	// ERROR RANDOM
	.add(
		"Member Targeting: Random Error, server 200",
		() => ({
			components: {
				Targeting
			},
			template: `<Targeting :url="MEMBER_TARGETING_URL_SUCCESS_RANDOM_ERROR" :$axios="axios"></Targeting>`,
			data: () => ({
				MEMBER_TARGETING_URL_SUCCESS_RANDOM_ERROR: MEMBER_TARGETING_URL_SUCCESS_RANDOM_ERROR,
				axios: axios
			})
		}),
		{
			info: {
				summary: `This simulates a server-side General 200 ERROR Axios HTTP call to the Member Targeting service`
			}
		}
	)
	// Error: Server 403
	.add(
		"Member Targeting: Server 403 and any other Random Errors",
		() => ({
			components: {
				Targeting
			},
			template: `<Targeting :url="MEMBER_TARGETING_URL_ERROR403" :$axios="axios"></Targeting>`,
			data: () => ({
				MEMBER_TARGETING_URL_ERROR403: MEMBER_TARGETING_URL_ERROR403,
				axios: axios
			})
		}),
		{
			info: {
				summary: `This simulates a server-side General 403 ERROR Axios HTTP call to the Member Targeting service`
			}
		}
	)
	// PROPS
	.add(
		"Member Targeting: Props",
		() => ({
			components: {
				Targeting
			},
			template: `<Targeting 
      :url="MEMBER_TARGETING_URL_SUCCESS" 
      :$axios="axios"
      search_string_prop = "Seattle, WA"
      search_radius_prop = 10 >
      </Targeting> `,

			data: () => ({
				MEMBER_TARGETING_URL_SUCCESS: MEMBER_TARGETING_URL_SUCCESS,
				axios: axios
			})
		}),
		{
			info: {
				summary: `This simulates a SUCCESSFUL Axios HTTP call to the Member Targeting service`
			}
		}
	);

// ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~ //
