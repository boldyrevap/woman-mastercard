import $ from "jquery";
import { DATA } from "./data";
import Test from "./test";

const test = new Test(DATA);

$(() => {
	test.init();
});
