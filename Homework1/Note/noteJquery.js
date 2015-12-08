$(function() {

    for (var key in localStorage) {
        if (key === "stickiesSort") {
            var stickiesSortArray = localStorage[key].split(",");
            for (var i = 1; i < stickiesSortArray.length; i++) {
                console.log(stickiesSortArray[i]);
                if (stickiesSortArray[i].substr(0, 7) === "sticky_") {
                    var appendTagForStickies = "<li id=\"" + stickiesSortArray[i] + "\" style=\"background-color:" + JSON.parse(localStorage[stickiesSortArray[i]]).color + "\">";
                    appendTagForStickies += "<span class=\"sticky\">" + JSON.parse(localStorage[stickiesSortArray[i]]).value + "</span></li>";
                    $('#stickies').append(appendTagForStickies);
                    $('#stickies').children().click(deleteSticky);
                }
            }
        }

    }
    $('#add_button').click(function() {
        //alert($("#note_color").find(":selected").val());
        var currentDate = new Date();
        var key = "sticky_" + currentDate.getTime();
        var sticky = {
            "value": $('#note_text').val(),
            "color": $("#note_color").find(":selected").val()
        };
        localStorage.setItem(key, JSON.stringify(sticky));
        var stickiesArray = getStickiesArray();
        localStorage.setItem("stickiesArray", JSON.stringify(stickiesArray));
        var appendTagForStickies = "<li id=\"" + key + "\" style=\"background-color:" + $("#note_color").find(":selected").val() + "\">";
        appendTagForStickies += "<span class=\"sticky\">" + $('#note_text').val() + "</span></li>";
        $('#stickies').append(appendTagForStickies);
        $('#stickies').children().click(deleteSticky);

    });

    $("#stickies").sortable({
        update: function() {
            var stickiesSort = $(this).sortable('toArray').toString();
            console.log(stickiesSort);
            localStorage.setItem("stickiesSort", stickiesSort);
            console.log(stickiesSort.split(",")[1] + "," + stickiesSort.split(",").length);
        }
    });
    $("#stickies").disableSelection();
});

function getStickiesArray() {
    var stickiesArray = [];
    for (var key in localStorage) {
        if (key.substr(0, 7) === "sticky_") {
            stickiesArray.push(key);
        }
    }
    return stickiesArray;
}

function deleteSticky(e) {
    localStorage.removeItem(e.target.id);
    var stickiesArray = getStickiesArray();
    localStorage.setItem("stickiesArray", JSON.stringify(stickiesArray));
    $("li#" + e.target.id).remove();
}
