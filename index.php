<!--Главная страница (!Delete this text!)-->
<?php
session_start();
?>
<!doctype html>
<html lang="en">
    <head>
        <meta charset="UTF-8">
        <meta name="viewport"
              content="width=device-width, user-scalable=no, initial-scale=1.0, maximum-scale=1.0, minimum-scale=1.0">
        <meta http-equiv="X-UA-Compatible" content="ie=edge">
        <title>FifteenIMG</title>
        <link rel="stylesheet" href="/app/css/styles.css">
    </head>
    <body>
        <div class="page">
            <div class="container">
                <div class="header">
                    <img class="logo" src="/app/images/Logo.png" alt="logo">
                    <div class="menu">
<!--                        <ul> Меню-->
<!--                            <li>Загрузка картинки-->
<!--                                <ul>-->
<!--                                    <li>-->
<!--                                        <div class="input_box">-->
<!--                                            <label for="picture">Загрузить картинку</label>-->
<!--                                            <input type="file"-->
<!--                                                   name="picture"-->
<!--                                                   id="field_picture"-->
<!--                                                   class="form-control"-->
<!--                                                   maxlength="24"-->
<!--                                                   placeholder="Загрузите картинку">-->
<!--                                        </div>-->
<!---->
<!--                                    </li>-->
<!--                                </ul>-->
<!--                            </li>-->
<!--                            <li>Ваши рекорды</li>-->
<!--                        </ul>-->

<!--                        <span class="img_load">Загрузка картинки</span>-->
                        <div class="input_box">
                            <label for="picture">Загрузить картинку</label>
                            <input type="file"
                                   name="picture"
                                   id="field_picture"
                                   class="form-control"
                                   maxlength="24"
                                   placeholder="Загрузите картинку">
                        </div>

                        <button type="submit" class="scores">Ваши рекорды</button>
                    </div>
                    <a href="#" class="profile">
                        <img class="profile_img" src="/app/images/Profile.png" alt="profile">
                    </a>

                </div>
                <div class="gamefield">
                    <div class="leftpart">
                        <div class="infoblock">
                            <span class="username" id="username">Name</span>
                            <div class="scoreinfo">
                                <span class="score" id="score">0</span>
                                <span class="timer" id="timer"><span class="min">&nbsp;00</span>:<span class="sec">00</span></span>

                            </div>
                            <img class="img_result" src="/app/images/siberia-nature.jpg" alt="result">
                            <span class="gametitle" id="gametitle">Fifteen IMG</span>
                        </div>
                        <button class="shufButton" id="shuffle">Перемешать</button>
                    </div>
                    <div class="gamepart">
                        <div class="game_Sh" id="game_Shuffle">
                            <div class="game" id="game1"></div>
                        </div>
                    </div>

                </div>
            </div>
        </div>

        <script src="/app/script/script.js"></script>

    </body>
</html>