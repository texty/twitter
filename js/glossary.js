$(function () {
    $("#tippy-template-list")
        .find("[data-template-id]")
        .each(function () {
            var template_id = $(this).data("template-id");
            var title = $("[data-template-id='" + template_id + "']").html();

            $(".term[data-template-ref='" + template_id + "']").attr("title", title);
        });

    tippy(".term", {
        animation: false,
        trigger: "click focus",
        interactive: true,
        duration: 0,
        delay: 0,
        distance: 15,
        size: "big"
    });

    // hide tippy on scroll
    window.addEventListener('scroll', function () {
        document.querySelectorAll('.tippy-popper').forEach(function (popper) {
            const instance = popper._tippy;

            if (instance.state.visible) {
                instance.popperInstance.disableEventListeners();
                instance.hide();
            }
        })
    });
});
