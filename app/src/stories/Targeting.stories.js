import { storiesOf } from "@storybook/vue";
import Targeting from "../components/Targeting.vue";

storiesOf("Targeting/Targeting", module).add("targeting", () => ({
	name: "member-targeting",
	components: { Targeting },
	template: `<Targeting></Targeting>`
}));
