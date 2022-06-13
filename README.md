# Chunithm New (International) Score Viewer

A bookmarklet tool let you to view the records of [CHUNITHM-NET (International)](https://chunithm-net-eng.com/) in rating order.

Chart constant data ~~extracted~~ compiled from [chunirec](https://developer.chunirec.net/docs/v2.0/).

## Some Notes

Even though [the original repository](https://github.com/kyroslee/chuni_intl_viewer) has updated to the NEW version, I'll still keep updating this project if needed, since I really need something to spur me on.

## Usage

1. Drag [chuni new intl viewer](https://github.com/Dogeon188/chuni_new_intl_viewer) to your bookmark bar.
2. Edit the bookmark. Copy the following code and paste it as the url of the bookmark

    ```js
    javascript:((d)=>{s=d.createElement("script");s.src="https://unpkg.com/chuni_new_intl_viewer/main.min.js";d.head.append(s);})(document)
    ```

3. Open [CHUNITHM-NET](https://chunithm-net-eng.com/) and run the bookmarklet
4. Wait for the program to finish

NOTE: The old "eval" script will still work (and being updated still), but it's still recommended to move to the new "unpkg" version for a probably safer and more stable experience.

## Dev

1. `npm install`
2. `npm run build`

## Tips

- If you're using iOS, you can take advantage of [this shortcut](https://www.icloud.com/shortcuts/fca95028ccf84a2f929a2aa9531368d3).
- If you want to run the bookmarklet on mobile chrome, type the name of the bookmark at url bar, and then click on the bookmark to execute the code.
- [How can a bookmarklet be ADDED on mobile Chrome without copying and pasting? - Android Enthusiasts Stack Exchange](https://android.stackexchange.com/questions/159308/how-can-a-bookmarklet-be-added-on-mobile-chrome-without-copying-and-pasting)
