$(document).ready(function(){
    $("body")
        .on("submit", "#register_form", submitUserRegister)
        .on("submit", "#login_form", submitLoginUser);
});

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