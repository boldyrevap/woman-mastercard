import $ from "jquery";
import WOW from "wowjs";
const wow = new WOW.WOW({
	live: false,
});

class Test {
	constructor(data) {
		this.$fact = $(".fact");
		this.$question = $(".overlay__question");
		this.$buttons = $(".overlay__right");
		this.$number = $(".overlay__number");
		this.$resultTitle = $(".overlay__name");
		this.$resultDesc = $(".overlay__description");
		this.$resultScore = $(".overlay__scores");
		this.$count = $(".overlay__count");
		this.$length = $(".overlay__length");
		this.$info = $(".overlay__info");

		this.ready = false;
		this.data = data;
		this.activeIndex = 0;
		this.stages = [
			{
				factId: 2,
			},
			{
				factId: 4,
			},
			{
				factId: 7,
			},
			{
				factId: 10,
			},
			{
				factId: 13,
			},
		];
		this.rightAnswers = 0;
		this.showResults = false;
		this.isOverlayVisible = false;
		this.isInfoWasShowed = false;
	}

	init() {
		this.bindEvents();
	}

	debounce(f, ms) {
		let isCooldown = false;

		return function () {
			if (isCooldown) return;

			f.apply(this, arguments);

			isCooldown = true;

			setTimeout(() => (isCooldown = false), ms);
		};
	}

	bindEvents() {
		$(window).on("load", () => {
			const delay = 200;
			$("body,html").animate(
				{
					scrollTop: 0,
				},
				delay
			);
			setTimeout(() => {
				this.ready = true;

				wow.init();
			}, delay * 2);
		});
		$(window).on("scroll", this.handleScroll);
		$(window).on(
			"mousewheel DOMMouseScroll",
			this.debounce(this.handleWheel, 500)
		);
		$(window).on("touchmove", function () {
			$(window).trigger("mousewheel");
		});
		this.$buttons.on("click", ".overlay__button", this.handleQuestionClick);
	}

	handleWheel = () => {
		if (this.isOverlayVisible && !this.isInfoWasShowed) {
			this.isInfoWasShowed = true;
			this.$info.addClass("show");
			setTimeout(() => {
				this.$info.removeClass("show");
			}, 5000);
		}
	};

	handleQuestionClick = (e) => {
		const isAnswerIsCorrect = $(e.target).data("correct");
		if (isAnswerIsCorrect) {
			this.rightAnswers += 1;
		}
		if (this.activeIndex < this.stages.length - 1) {
			this.activeIndex += 1;
		} else {
			this.showResults = true;
		}
		this.isOverlayVisible = false;
		this.$info.removeClass("show");
		this.isInfoWasShowed = false;
		this.hideOverlay();
	};

	handleScroll = () => {
		if (!this.ready) return;
		const currentState = this.stages[this.activeIndex];
		if (this.showResults) {
			this.showOverlay();
			this.renderResults();
			return;
		}
		const { factId } = currentState;
		const factOffset = this.$fact.eq(factId).offset();
		const factHeight = this.$fact.eq(factId).height();
		const factBottom = factOffset.top + factHeight;
		const scrollBottom = $(window).scrollTop() + $(window).height();
		if (!this.showResults && scrollBottom >= factBottom) {
			this.isOverlayVisible = true;
			this.showOverlay();
			this.renderQuestion();
		}
	};

	showOverlay() {
		$(".overlay").addClass("active");
		$("body").addClass("block");
	}

	hideOverlay() {
		$(".overlay").removeClass("active");
		$("body").removeClass("block");
	}

	renderQuestion() {
		const { text, answers } = this.data.questions[this.activeIndex];
		this.$question.html("");
		this.$buttons.html("");
		this.$count.html(`0${this.activeIndex + 1}`);
		this.$length.html(`0${this.stages.length}`);
		this.$question.html(text);
		answers.forEach((item) => {
			this.$buttons.append(
				`<button class="overlay__button" data-correct="${item.isRight}">${item.text}</button>`
			);
		});
	}

	renderResults() {
		const { result } = this.data;
		let rightId;
		if (this.rightAnswers === 0) {
			rightId = 1;
		} else {
			rightId = this.rightAnswers;
		}
		const { title, text } = result[rightId - 1];
		$(".overlay").addClass("show-result");
		$("body").removeClass("block");
		this.$resultTitle.html(title);
		this.$resultDesc.html(text);
		this.$resultScore.html(
			`(верно ${this.rightAnswers} из ${this.stages.length})`
		);
	}
}

export default Test;
