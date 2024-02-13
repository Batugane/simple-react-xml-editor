import { Editor } from "@monaco-editor/react";
import React, { useState, useRef, useEffect } from "react";

type CustomEditorProps = {
  style?: React.CSSProperties;
};

const CustomEditor = (props: CustomEditorProps) => {
  const [editorTheme, setEditorTheme] = useState("vs-dark");
  const [editorContent, setEditorContent] = useState("");
  const [editorHeight, setEditorHeight] = useState("60vh");
  const [editorWidth, setEditorWidth] = useState("100%");
  const [fontSize, setFontSize] = useState(14);
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const editorRef = useRef<any>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth < 768) {
        setEditorHeight("50vh"); // Adjust for smaller screens
      } else {
        setEditorHeight("60vh"); // Default size for larger screens
      }
    };

    window.addEventListener("resize", handleResize);
    handleResize();

    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const handleThemeChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    setEditorTheme(event.target.value);
  };

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file && file.type === "text/xml") {
      const reader = new FileReader();
      reader.onload = (e) => {
        const fileContent = e.target?.result as string;
        setEditorContent(fileContent);
        if (editorRef.current) {
          editorRef.current.setValue(fileContent);
        }
      };
      reader.readAsText(file);
    } else {
      alert("Please upload a valid XML file.");
    }
  };

  const handleUploadClick = () => {
    fileInputRef.current?.click();
  };

  const handleDownload = () => {
    const blob = new Blob([editorContent], { type: "text/xml" });
    const href = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = href;
    //todo: dynamic file name
    link.download = "downloadFileName";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(href);
  };

  const handleCopyToClipboard = () => {
    if (editorRef.current) {
      const currentContent = editorRef.current.getValue();
      navigator.clipboard.writeText(currentContent).catch((err) => {
        console.error("Error copying text: ", err);
      });
    }
  };

  const handleClearEditor = () => {
    setEditorContent("");
    if (editorRef.current) {
      editorRef.current.setValue("");
    }
  };

  const handleFontSizeChange = (
    event: React.ChangeEvent<HTMLSelectElement>
  ) => {
    setFontSize(Number(event.target.value));
  };

  const editorOptions = {
    autoIndent: "advanced" as const,
    formatOnPaste: true,
    formatOnType: true,
    folding: true,
    lineNumbers: "on" as const,
    minimap: { enabled: false },
    renderLineHighlight: "all" as const,
    bracketPairColorization: { enabled: true },
    scrollBeyondLastLine: false,
    fontSize: fontSize,
  };

  const editorContainerStyle: React.CSSProperties = {
    ...props.style,
    display: "flex",
    flexDirection: "column",
    backgroundColor: "#333",
    border: "2px solid #444",
    borderRadius: "4px",
    padding: "15px",
    overflow: "hidden",
    maxWidth: "100%",
  };

  const buttonStyle: React.CSSProperties = {
    backgroundColor: "#555",
    color: "white",
    border: "none",
    borderRadius: "3px",
    padding: "8px 15px",
    margin: "5px",
    cursor: "pointer",
    transition: "background-color 0.3s",
  };
  const handleButtonMouseOver = (
    event: React.MouseEvent<HTMLButtonElement, MouseEvent>
  ) => {
    event.currentTarget.style.backgroundColor = "#777";
  };

  const handleButtonMouseOut = (
    event: React.MouseEvent<HTMLButtonElement, MouseEvent>
  ) => {
    event.currentTarget.style.backgroundColor = "#555";
  };

  return (
    <div className="editor-container" style={editorContainerStyle}>
      <div style={{ marginBottom: "10px" }}>
        <select
          onChange={handleThemeChange}
          value={editorTheme}
          style={{ ...buttonStyle, cursor: "pointer" }}
        >
          <option value="vs-dark">vs-dark</option>
          <option value="light">light</option>
          <option value="hc-black">hc-black</option>
        </select>
        <button onClick={handleCopyToClipboard} style={buttonStyle}>
          Copy to Clipboard
        </button>
        <button onClick={handleClearEditor} style={buttonStyle}>
          Clear Editor
        </button>
        <select
          onChange={handleFontSizeChange}
          value={fontSize}
          style={{ ...buttonStyle, cursor: "pointer" }}
        >
          {" "}
          <option value="10">10px</option>
          <option value="12">12px</option>
          <option value="14">14px</option>
          <option value="16">16px</option>
          <option value="18">18px</option>
          <option value="20">20px</option>
        </select>
        <button
          onClick={handleUploadClick}
          style={buttonStyle}
          onMouseOver={handleButtonMouseOver}
          onMouseOut={handleButtonMouseOut}
        >
          Upload File
        </button>
        <button
          onClick={handleDownload}
          style={buttonStyle}
          onMouseOver={handleButtonMouseOver}
          onMouseOut={handleButtonMouseOut}
        >
          Download XML
        </button>
      </div>
      <input
        type="file"
        ref={fileInputRef}
        onChange={handleFileUpload}
        style={{ display: "none" }}
        accept=".xml"
      />
      <Editor
        height={editorHeight}
        width={editorWidth}
        theme={editorTheme}
        defaultLanguage="xml"
        value={editorContent}
        options={editorOptions}
        onMount={(editor) => (editorRef.current = editor)}
      />
    </div>
  );
};

export default CustomEditor;
