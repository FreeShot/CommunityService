postrender["Associate Special Passages"] = function (content, taskName) {
	setPageElement("story-title", "StoryTitle", Story.title);
	setPageElement("story-author","StoryAuthor");
	setPageElement("ui-cuff", "CUFF");
}

/* Set up a handler for the enabling and disabling of the history-backward/-forward buttons. */
jQuery(document)
	.on(':historyupdate.ui-bar',
		(function ($backward, $forward) {
			return function () {
				$backward.prop('disabled', State.length < 2);
				$forward.prop('disabled', State.length === State.size);
			};
		})(jQuery('#history-backward'), jQuery('#history-forward'))
	);

/* Set up a handler for the selection of the history-backward button. */
jQuery('#history-backward')
	.prop('disabled', State.length < 2)
	.ariaClick({
		label : L10n.get('uiBarBackward')
	}, function () {
		Engine.backward()
	});

/* Set up a handler for the selection of the history-forward button. */
jQuery('#history-forward')
	.prop('disabled', State.length === State.size)
	.ariaClick({
		label : L10n.get('uiBarForward')
	}, function () {
		Engine.forward()
	});


$('#save').ariaClick(UI.saves);
$('#restart').ariaClick(UI.restart);
$('#settings').ariaClick(UI.settings);