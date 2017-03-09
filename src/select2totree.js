/*!
 * Select2-to-Tree 0.6.0
 * https://github.com/clivezhg/select2-to-tree/
 */
(function ($) {
	$.fn.select2ToTree = function (options) {
		var defaults = {
			theme: "default" // set this option (e.g., "bootstrap") to set different style
		};
		var opts = $.extend(defaults, options);
		if (opts.treeData) {
			buildSelect(opts.treeData, this);
		}
		opts.templateResult = function (data, container) {
			if (data.element) {
				var ele = data.element;
				container.setAttribute("data-val", ele.value);
				if (ele.className) container.className += " " + ele.className;
				if (ele.getAttribute("data-pup")) {
					container.setAttribute("data-pup", ele.getAttribute("data-pup"));
				}
				if ($(container).hasClass("non-leaf")) {
					return $('<span class="expand-collapse"></span>').text(data.text);
				}
			}
			return $('<span></span>').text(data.text);
		};

		var expandCollapseTime = 0;

		var s2inst = this.select2(opts);
		s2inst.on("select2:selecting select2:unselecting", function (evt) {
			if (Date.now() - expandCollapseTime < 160) {
				evt.preventDefault();
			}
		});

		s2inst.on("select2:closing", function (evt) { // If the clicked is the selected, no 'selecting' will be fired, and 'closing' will be raised
			if (Date.now() - expandCollapseTime < 160) {
				evt.preventDefault();
			}
		});

		s2inst.on("select2:open", function (evt) {
			var s2data = s2inst.data("select2");
			/* In 3.X, we can use the 'onSelect' method. "The 4.0 release...At the core, it is a full rewrite..." */
			// The 'click' event will be after 'select2:selecting'
			s2data.$dropdown.addClass("s2-to-tree");
			s2data.$dropdown.find(".searching-result").removeClass("searching-result");
			s2data.$dropdown.off("mousedown", ".expand-collapse", mousedownHandler);
			s2data.$dropdown.on("mousedown", ".expand-collapse", mousedownHandler);
			var $allsch = s2data.$dropdown.find(".select2-search__field").add( s2data.$container.find(".select2-search__field") );
			$allsch.off("input", inputHandler);
			$allsch.on("input", inputHandler);
		});
		function mousedownHandler(evt) {
			toggleSubOptions(evt.target);
			evt.stopPropagation();
			expandCollapseTime = Date.now();
		}
		function inputHandler(evt) {
			var s2data = s2inst.data("select2");
			if ($(this).val().trim().length > 0) {
				s2data.$dropdown.addClass("searching-result");
			}
			else {
				s2data.$dropdown.removeClass("searching-result");
			}
		}

		return s2inst;
	};

	function buildSelect(treeData, $el) {
		function buildOptions(dataArr, curLevel, pup) {
			for (var i = 0; i < dataArr.length; i++) {
				var data = dataArr[i];
				var $opt = $("<option></option>");
				$opt.text(data[treeData.labelFld || "name"]);
				$opt.val(data[treeData.valFld || "id"]);
				$opt.addClass("l" + curLevel);
				if (pup) $opt.attr("data-pup", pup);
				$el.append($opt);
				var inc = data[treeData.valFld || "inc"];
				if (inc) {
					$opt.addClass("non-leaf");
					buildOptions(inc, curLevel+1, $opt.val());
				}
			}
		}
		buildOptions(treeData.dataArr, 1, "");
		if (treeData.dftVal) $el.val(treeData.dftVal);
	}

	function toggleSubOptions(target) {
		$(target.parentNode).toggleClass("opened");
		showHideSub(target.parentNode);
	}

	function showHideSub(ele) {
		var curEle = ele;
		var shouldShow = true;
		do {
			var pup = $(curEle).attr("data-pup");
			curEle = null;
			if (pup) {
				var pupEle = $(".select2-container li.select2-results__option[data-val='" + pup + "']");
				if (pupEle.length > 0) {
					if (!pupEle.eq(0).hasClass("opened")) {
						$(ele).removeClass("showme");
						shouldShow = false;
						break;
					}
					curEle = pupEle[0];
				}
			}
		} while (curEle);
		if (shouldShow) $(ele).addClass("showme");

		var val = $(ele).attr("data-val");
		$(".select2-container li.select2-results__option[data-pup='" + val + "']").each(function () {
			showHideSub(this);
		});
	}
})(jQuery);
