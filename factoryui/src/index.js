import { Launch } from 'wpe-lightning-sdk'
import App from './App.js'

export default function() {
  return Launch(App, ...arguments)
}


/*

<!DOCTYPE html>
<html lang="en">
    <head>
        <meta charset="UTF-8" />
    </head>
    <body style="background-color:black;">
      <script src="./startApp.js"></script>
    </body>
</html>

*/
