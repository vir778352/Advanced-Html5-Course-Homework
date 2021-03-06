$(function() {
    //localStorage.clear();
    checkFolderCount();
    addDOM();
    addFolderDOM();
    addSelectDom();

    $('#saveButton').click(save);

    $('#clearButton').click(remove);

    $('#addButton').click(function() {
        $('#currentTime').text(timeStr);
    });
    $('#editButton').click(modify);

    $('#addFolderButton').click(saveFolder);

    $('#refreshPage').click(function() {
        checkFolderCount();
        location.reload();
    });

    $("#createFolderButton").click(function() {
        checkFolderCount();
        location.reload();
    });

    $('#clearFolderButton').click(clearFolder);


    $("#itemsFolder").sortable({
        update: function() {
            alert("updateSort");
            var itemsFolderSort = $(this).sortable('toArray').toString() + ",";
            localStorage.setItem("itemsFolderSort", itemsFolderSort);
            //console.log(itemsFolderSort.split(",")[1] + "," + itemsFolderSort.split(",").length);
        }
    });

});

function init() {
    localStorage.setItem("mouFolderDefault", JSON.stringify({
        "value": "未分類",
        "count": 0
    }));
}

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
    var mouJSON = {
        "value": $('#textArea').val(),
        "folderKeyId": $("#selectFolder").find(":selected").val()
    };
    var key = "mou_" + $('#currentTime').text();
    if ($('#textArea').val() !== "") {
        localStorage.setItem(key, JSON.stringify(mouJSON));
    }

    $('#textArea').val("");
    addDOM();
}

function modifyPage() {
    var folderId = JSON.parse(localStorage[this.id]).folderKeyId;
    if (folderId.substr(0, 4) === "mouF") {
        if (folderId === "mouFolderDefault") {
            $('#modifyPage h2').text("/ " + "未分類" + " / ..");
        } else {
            $('#modifyPage h2').text("/ " + JSON.parse(localStorage[folderId]).value + " / ..");
        }
    }

    $('#currentTime01').text(this.id.slice(4));
    $('#textArea01').val(JSON.parse(localStorage[this.id]).value);
}

function modify() {
    var beforeKey = "mou_" + $('#currentTime01').text();
    if ($('#textArea01').val() !== "") {
        localStorage.removeItem(beforeKey);
        var modifyJSON = {
            "value": $('#textArea01').val(),
            "folderKeyId": $("#selectFolder01").find(":selected").val()
        };
        $('#currentTime01').text(timeStr);
        var key = "mou_" + $('#currentTime01').text();
        localStorage.setItem(key, JSON.stringify(modifyJSON));
        addDOM();
    }
}

function remove() {
    var beforeKey = "mou_" + $('#currentTime01').text();
    localStorage.removeItem(beforeKey);
    $('#textArea').val("");
    addDOM();
}

function addDOM() {
    $('#items').children().remove();

    for (var key in localStorage) {
        if (key.substr(0, 4) === "mou_") {
            var appendContext = "<li id=\"" + key + "\">" + "<a href=\"#modifyPage\">" + JSON.parse(localStorage[key]).value + "</a>";
            appendContext += "<span class=\"ui-li-count\">" + key.split("_")[1] + "</span></li>";
            $('#items').append(appendContext);
            $('#items').children().click(modifyPage);
        }
    }
    $('#items').listview().listview('refresh');
}

function saveFolder() {
    var folderValue = {
        "value": $('#folderText').val(),
        "count": 0
    };
    var currentDate = new Date();
    var key = "mouFolder_" + currentDate.getTime();
    if ($('#folderText').val() !== "") {
        //localStorage.setItem(key, $('#folderText').val());
        localStorage.setItem(key, JSON.stringify(folderValue));
        //sortArray
        var keyOfSort = "itemsFolderSort";
        if (localStorage[keyOfSort]) {
            var valueOfSort = localStorage[keyOfSort] + key + ",";
            localStorage.setItem(keyOfSort, valueOfSort);
        }
    }
    $('#folderText').val("");
    addFolderDOM();
}

function addFolderDOM() {

    $('#itemsFolder').children().remove();
    var defaultKey = "mouFolderDefault";
    var isItemsFolderSort = false;

    for (var key in localStorage) {
        if (key.substr(0, 9) === "mouFolder") {
            var appendContext = "<li id=\"" + key + "\">" + "<a href=\"#sortPage\">" + JSON.parse(localStorage[key]).value + "</a>";
            appendContext += "<span class=\"ui-li-count\">" + JSON.parse(localStorage[key]).count + "</span></li>";
            $('#itemsFolder').append(appendContext);
        }
        if (key === "itemsFolderSort") {
            isItemsFolderSort = true;
        }
    }

    if (isItemsFolderSort) {
        var key1 = 'itemsFolderSort';
        var itemsFolderSortArray = localStorage[key1].split(",");
        $('#itemsFolder').children().remove();
        for (var i = 0; i < itemsFolderSortArray.length - 1; i++) {
            console.log(itemsFolderSortArray[i]);
            var appendContext01 = "<li id=\"" + itemsFolderSortArray[i] + "\">" + "<a href=\"#sortPage\">" + JSON.parse(localStorage[itemsFolderSortArray[i]]).value + "</a>";
            appendContext01 += "<span class=\"ui-li-count\">" + JSON.parse(localStorage[itemsFolderSortArray[i]]).count + "</span></li>";
            $('#itemsFolder').append(appendContext01);
        }
    }

    $('#itemsFolder').children().click(sortPageDOM);
    $('#itemsFolder').listview().listview('refresh');

    addSelectDom("selectFolder01");
    addSelectDom("selectFolder");
}

function addSelectDom(id) {
    $('#' + id).children().remove();
    $('#' + id).append("<option>選擇放入的資料夾</option>");
    for (var key1 in localStorage) {
        if (key1.substr(0, 9) === "mouFolder") {
            var appendSelectFolder01 = "<option value=\"" + key1 + "\">" + JSON.parse(localStorage[key1]).value + "</option>";

            $('#' + id).append(appendSelectFolder01);
        }
    }
    $("select option[value='mouFolderDefault']").attr("selected", "selected");
}

function sortPageDOM() {
    $('#sortPage h1').text("[資料夾]" + JSON.parse(localStorage[this.id]).value);
    $('#sortItems').children().remove();
    for (var key in localStorage) {
        if (key.substr(0, 4) === "mou_" && this.id === JSON.parse(localStorage[key]).folderKeyId) {
            var appendContext = "<li id=\"" + key + "\">" + "<a href=\"#modifyPage\">" + JSON.parse(localStorage[key]).value + "</a>";
            appendContext += "<span class=\"ui-li-count\">" + key.split("_")[1] + "</span></li>";
            $('#sortItems').append(appendContext);
            $('#sortItems').children().click(modifyPage);
        }
    }

    $('#sortPage').attr("key", this.id);
    $('#sortItems').listview().listview('refresh');
}

function checkFolderCount() {
    for (var key1 in localStorage) {
        if (key1.substr(0, 9) === "mouFolder") {
            localStorage.setItem(key1, JSON.stringify({
                "value": JSON.parse(localStorage[key1]).value,
                "count": 0
            }));
        }
    }

    init();
    for (var key in localStorage) {
        if (key.substr(0, 4) === "mou_") {
            var folderId = JSON.parse(localStorage[key]).folderKeyId;
            var count = parseInt(JSON.parse(localStorage[folderId]).count) + 1;
            localStorage.setItem(folderId, JSON.stringify({
                "value": JSON.parse(localStorage[folderId]).value,
                "count": count
            }));

        }

    }
}

function clearFolder() {
    var keyId = $('#sortPage').attr("key");

    if (keyId === "mouFolderDefault") {
        alert("此資料夾不可刪除!");
    } else {
        if (confirm("是否刪除此資料夾及內部所有資料")) {
            //sortArray
            var keyOfSort = "itemsFolderSort";
            if (localStorage[keyOfSort]) {
                //var valueOfSort = localStorage[keyOfSort] + "," + key;
                var valueOfSort = localStorage[keyOfSort].replace((keyId + ','), "");
                localStorage.setItem(keyOfSort, valueOfSort);
            }

            for (var key in localStorage) {
                if (key.substr(0, 4) === "mou_" && keyId === JSON.parse(localStorage[key]).folderKeyId) {
                    localStorage.removeItem(key);
                }
            }
            localStorage.removeItem(keyId);
        }
    }
}
