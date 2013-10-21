$(function() {
    var client = new WindowsAzure.MobileServiceClient('https://attsmstest.azure-mobile.net/', 'jgOYWiKmHZFDpltJKnGRJAdAeLnqKH57'),
        todoItemTable = client.getTable('todoitem');

    // Read current data and rebuild UI.
    // If you plan to generate complex UIs like this, consider using a JavaScript templating library.
    function refreshTodoItems() {
        var query = todoItemTable.where({ complete: false }).orderByDescending('id');

        query.read().then(function(todoItems) {
            var listItems = $.map(todoItems, function(item) {
                return $('<li>')
                    .attr('data-todoitem-id', item.id)
                    .append($('<button class="item-delete">Delete</button>'))
                    .append($('<input type="checkbox" class="item-complete">').prop('checked', item.complete))
                    .append($('<div>').append($('<input class="item-text">').val(item.text)));
            });

            $('#todo-items').empty().append(listItems).toggle(listItems.length > 0);
            $('#summary').html('<strong>' + todoItems.length + '</strong> item(s)');
        }, handleError);
    }

    function handleError(error) {
        var text = error + (error.request ? ' - ' + error.request.status : '');
        $('#errorlog').append($('<li>').text(text));
    }

    function getTodoItemId(formElement) {
        return Number($(formElement).closest('li').attr('data-todoitem-id'));
    }

    // Handle insert
    $('#add-item').submit(function(evt) {
        var textbox = $('#new-item-text'),
            itemText = textbox.val();
		var googleSenderId = 'APA91bE96GpDUdSD-NxGWGIa_R874TKExoHNJunUkX7gdYk6vnvmMriLpsp2ZciLB3sDV0rOMtzeOu2Rn1JtvJbs_0lCrXPBwp-wBinKQCujw8Vq4EuN6ZY21qOiMenCXAn160_-UuD51dtGAHpDIIYZ6TYl6XAcZdMVA9VwJC6JpzcTKbJ5ikM'; // sm095n added for GCM	
        if (itemText !== '') {
            todoItemTable.insert({ text: itemText, complete: false, channel: googleSenderId }).then(refreshTodoItems, handleError);
        }
        textbox.val('').focus();
        evt.preventDefault();
    });

    // Handle update
    $(document.body).on('change', '.item-text', function() {
        var newText = $(this).val();
        todoItemTable.update({ id: getTodoItemId(this), text: newText }).then(null, handleError);
    });

    $(document.body).on('change', '.item-complete', function() {
        var isComplete = $(this).prop('checked');
        todoItemTable.update({ id: getTodoItemId(this), complete: isComplete }).then(refreshTodoItems, handleError);
    });

    // Handle delete
    $(document.body).on('click', '.item-delete', function () {
        todoItemTable.del({ id: getTodoItemId(this) }).then(refreshTodoItems, handleError);
    });

    // On initial load, start by fetching the current data
    refreshTodoItems();
});