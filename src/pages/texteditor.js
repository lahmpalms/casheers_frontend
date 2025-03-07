import React, { useRef, useState } from "react";
import { Editor } from "@tinymce/tinymce-react";

function TextEditor() {
  const [htmlCode, setHtmlCode] = useState("");
  const editorRef = useRef(null);

  const handleEditorChange = (content, editor) => {
    setHtmlCode(content);
  };

  return (
    <div style={{ padding: "20px" }}>
      <div
        className="text-editor-container"
        style={{ display: "flex", flexDirection: "row", marginTop: "20px" }}
      >
        <div className="left-pane" style={{ flex: 1, marginRight: "10px" }}>
          <textarea
            placeholder="Paste your HTML code here..."
            value={htmlCode}
            onChange={(e) => setHtmlCode(e.target.value)}
            style={{
              width: "100%",
              height: "calc(100vh - 200px)",
              borderRadius: "10px",
              padding: "10px",
              border: "1px solid #ccc",
              boxSizing: "border-box",
            }}
          />
        </div>
        <div className="right-pane" style={{ flex: 1 }}>
          <Editor
            apiKey={process.env.NEXT_PUBLIC_TINYMCE_API_KEY}
            onInit={(evt, editor) => (editorRef.current = editor)}
            value={htmlCode}
            onEditorChange={handleEditorChange}
            init={{
              height: "calc(100vh - 200px)",
              width: "100%",
              advcode_inline: true,
              menubar: false,
              plugins: [
                "advlist",
                "autolink",
                "lists",
                "link",
                "image",
                "charmap",
                "preview",
                "anchor",
                "searchreplace",
                "visualblocks",
                "code",
                "fullscreen",
                "insertdatetime",
                "media",
                "table",
                "code",
                "help",
                "wordcount",
              ],
              toolbar:
                "undo redo | styles | bold italic | alignleft aligncenter alignright alignjustify | bullist numlist outdent indent | link image | print preview media | forecolor backcolor emoticons",
              content_style:
                "body { font-family:Helvetica,Arial,sans-serif; font-size:14px }",
              forced_root_block: "p",
              paste_as_text: false,
            }}
          />
        </div>
      </div>
    </div>
  );
}

export default TextEditor;
