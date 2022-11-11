$(document).ready(function(){
    $("body")
        .on("submit", "#register_form", submitUserRegister)
        .on("submit", "#login_form", submitLoginUser)
        .on("submit", "#add_message_form", submitPostMessage)
        .on("submit", ".add_comment_form", submitPostComment)
        .on("submit", ".delete_message_form", submitDeleteMessage);
});

function submitLoginUser(){
    let login_form = $(this);

    $.post(login_form.attr("action"), login_form.serialize(), (data) => {
        if(data.status){
            window.location.href = "/wall";
        }
        else{

        }
    });

    return false;
}

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

function submitPostMessage(){
    let add_message_form = $(this);

    $.post(add_message_form.attr("action"), add_message_form.serialize(), (data) => {
        if(data.status){
            $(".message-section").append(data.new_message_html);
            $(".message-section textarea").val("");
        }
        else{

        }
    });

    return false;
}

function submitPostComment(){
    let add_comment_form = $(this);

    $.post(add_comment_form.attr("action"), add_comment_form.serialize(), (data) => {
        if(data.status){
            $(`.comment-section.message_id_${data.result.message_id} .comments`).append(data.new_comment_html);
            $(`.comment-section.message_id_${data.result.message_id} form textarea`).val("");
        }
        else{

        }
    });

    return false;
}

function submitDeleteMessage(){
    let delete_message_form = $(this);

    $.post(delete_message_form.attr("action"), delete_message_form.serialize(), (data) => {
        if(data.status){
            $(`.message_${data.result}`).remove();
            $(`.comment-section.message_id_${data.result}`).remove()
        }
        else{

        }
    });

    return false;
}