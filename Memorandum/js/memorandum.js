$(function() {
    addDOM();

    $('#saveButton').click(save);

    $('#clearButton').click(remove);

    $('#addButton').click(function() {
        $('#currentTime').text(timeStr);
    });
    $('#editButton').click(modify);
});

function timeStr() {
    var currentDate = new Date();
    var dayStr = currentDate.getFullYear() + "年" + (currentDate.getMonth() + 1) + "月" + currentDate.getDate() + "日_";
    var hour = "0" + currentDate.getHours();
    var minute = "0" + currentDate.getMinutes();
    var second = "0" + currentDate.getSeconds();
    dayStr += hour.slice(-2) + ":" + minute.slice(-2) + ":" + second.slice(-2);
    return dayStr;
}

function save() {
    var key = "mou_" + $('#currentTime').text();
    if ($('#textArea').val() !== "")
        localStorage.setItem(key, $('#textArea').val());
    $('#textArea').val("");
    $('#items').children().remove();
    addDOM();
}

function modifyPage() {
    $('#currentTime01').text(this.id.slice(4));
    $('#textArea01').val(localStorage[this.id]);
}

function modify() {
    var beforeKey = "mou_" + $('#currentTime01').text();
    if ($('#textArea01').val() !== "") {
        localStorage.removeItem(beforeKey);
        $('#currentTime01').text(timeStr);
        var key = "mou_" + $('#currentTime01').text();
        localStorage.setItem(key, $('#textArea01').val());
        $('#items').children().remove();
        addDOM();
    }
}

function remove() {
    var beforeKey = "mou_" + $('#currentTime01').text();
    localStorage.removeItem(beforeKey);
    $('#textArea').val("");
    $('#items').children().remove();
    addDOM();
}

function addDOM() {
    $('#items').children().remove();
    for (var key in localStorage) {
        if (key.substr(0, 4) === "mou_") {
            var appendContext = "<li id=\"" + key + "\">" + "<a href=\"#modifyPage\">" + localStorage[key] + "</a>";
            appendContext += "<span class=\"ui-li-count\">" + key.split("_")[1] + "</span></li>";
            $('#items').append(appendContext);
            $('#items').children().click(modifyPage);
        }
    }
    $('#items').listview('refresh');
}
