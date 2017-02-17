# nodejs-msbot

This repository is to showcase the working of different api's provided by [Microsoft Bot Framework](https://dev.botframework.com/) .

It queries from [omdbAPI](http://www.omdbapi.com/) a free movie API to work with :beer:.




> #### Configuration
>
> rename the `config.sample.json` file to `config.json`
>
> Update it with your own APPId and Password
>
> ```json
> {
>   "appId": "YOUR APP ID",
>   "appPassword": "YOUR APP PASSWORD",
>   "port":3978
> }
> ```



> ####  Running the code
> run `npm start` to start the repository
>
> Open the bot emulator and point it to http://localhost:3978/api/messages



> #### Quick Note
>
> It uses `/api/messages` URL to send and receive the messages