# Chunithm New (International) Score Viewer

A bookmarklet tool let you to view the records of [CHUNITHM-NET (International)](https://chunithm-net-eng.com/) in rating order.

Chart constant data ~~extracted~~ compiled from [chunirec](https://developer.chunirec.net/docs/v2.0/).

## Some Notes

[The original repository](https://github.com/kyroslee/chuni_intl_viewer) isn't working now, so I ~~just modified it a bit~~ remade the score viewer to make it function again. Therefore, I own ~~nothing in this git~~, nor the sacred chunirec API token.

## Usage

1. Drag [chuni new intl viewer](https://github.com/Dogeon188/chuni_new_intl_viewer) to your bookmark bar.
2. Edit the bookmark. Copy the following code and paste it as the url of the bookmark

    ```js
    javascript:(async()=>{eval(await(await fetch('https://raw.githubusercontent.com/Dogeon188/chuni_new_intl_viewer/main/main.min.js')).text())})();
    ```

3. Open [CHUNITHM-NET](https://chunithm-net-eng.com/) and run the bookmarklet
4. Wait for the program to finish

## Dev

1. `npm install`
2. `npm run build`

## Tips

- If you want to run the bookmarklet on mobile chrome, type the name of the bookmark at url bar, and then click on the bookmark to execute the code.
- [How can a bookmarklet be ADDED on mobile Chrome without copying and pasting? - Android Enthusiasts Stack Exchange](https://android.stackexchange.com/questions/159308/how-can-a-bookmarklet-be-added-on-mobile-chrome-without-copying-and-pasting)
