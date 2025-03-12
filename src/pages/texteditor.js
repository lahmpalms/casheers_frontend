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
              content_style: `
                body { 
                  font-family: Arial, Helvetica, sans-serif; 
                  font-size: 14px;
                  line-height: 1.5;
                  margin: 0;
                  padding: 16px;
                }
                p { margin: 0 0 1em 0; }
                table { border-collapse: collapse; }
                table td, table th { border: 1px solid #ddd; padding: 8px; }
                img { max-width: 100%; height: auto; }
                .mce-content-body [data-mce-selected=inline-boundary] { background-color: transparent; }
              `,
              forced_root_block: false,
              force_br_newlines: true,
              force_p_newlines: false,
              convert_fonts_to_spans: true,
              paste_as_text: true,
              convert_urls: false,
              keep_styles: true,
              valid_elements: '*[*]',
              extended_valid_elements: 'style,link[href|rel]',
            }}
          />
        </div>
      </div>
    </div>
  );
}

export default TextEditor;
