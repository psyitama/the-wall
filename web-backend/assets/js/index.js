$(document).ready(function(){
    $("body")
        .on("submit", "#register_form", submitUserRegister)
        .on("submit", "#login_form", submitLoginUser)
        .on("submit", ".add_message_form", submitPostMessage)
        .on("submit", ".add_comment_form", submitPostComment)
        .on("submit", ".delete_message_form", submitDeleteMessage)
        .on("submit", ".delete_comment_form", submitDeleteComment);
});

/* Function for login user API call */
function submitLoginUser(){
    let login_form = $(this);

    $.post(login_form.attr("action"), login_form.serialize(), (data) => {
        if(data.status){
            window.location.href = "/wall";
        }
        else{
            $(".login span").text("Something went wrong");
        }
    });

    return false;
}

/* Function for register user API call */
function submitUserRegister(){
    let register_form = $(this);

    $.post(register_form.attr("action"), register_form.serialize(), (data) => {
        if(data.status){
            $(".register span").text("");
            $("#register_form input[type=text], #register_form input[type=password]").each(function() {
                $(this).val("");
            });
        }
        else{
            $(".register span").text("Something went wrong");
        }
    });

    return false;
}

/* Function for add message API call */
function submitPostMessage(){
    let add_message_form = $(this);

    $.post(add_message_form.attr("action"), add_message_form.serialize(), (data) => {
        if(data.status){
            $(".message-section .messages").append(data.new_message_html);
            $(".message-section .add_message_form textarea").val("");
        }
        else{
            alert("Failed to post message.");
        }
    });

    return false;
}

/* Function for delete message API call */
function submitDeleteMessage(){
    let delete_message_form = $(this);

    $.post(delete_message_form.attr("action"), delete_message_form.serialize(), (data) => {
        if(data.status){
            $(`.message_${data.result}`).remove();
        }
        else{
            alert("Failed to delete message.");
        }
    });

    return false;
}

/* Function for add comment API call */
function submitPostComment(){
    let add_comment_form = $(this);

    $.post(add_comment_form.attr("action"), add_comment_form.serialize(), (data) => {
        if(data.status){
            $(`.comment-section.message_id_${data.result.message_id} .comments`).append(data.new_comment_html);
            $(`.comment-section.message_id_${data.result.message_id} form textarea`).val("");
        }
        else{
            alert("Failed to post comment.");
        }
    });

    return false;
}

/* Function for delete comment API call */
function submitDeleteComment(){
    let delete_comment_form = $(this);

    $.post(delete_comment_form.attr("action"), delete_comment_form.serialize(), (data) => {
        if(data.status){
            $(`.comments .comment_id_${data.result}`).remove();
        }
        else{
            alert("Failed to delete comment.");
        }
    });

    return false;
}
