type Props = {
  role: string;
  content: string;
};

export default function MessageBubble({ role, content }: Props) {
  const isUser = role === "user";

  const renderContent = (text: string) => {
    const parts = text.split(/```/); // split by code fences
    const elements: JSX.Element[] = [];
    let key = 0;

    parts.forEach((part, idx) => {
      if (idx % 2 === 1) {
        // CODE BLOCK
        elements.push(
          <pre
            key={`code-${key++}`}
            className="bg-black/60 text-green-300 text-sm rounded-lg p-3 overflow-x-auto whitespace-pre-wrap font-mono"
          >
            <code>{part.trim()}</code>
          </pre>
        );
      } else {
        // TEXT BLOCK (lists + paragraphs)
        const lines = part.split("\n");
        let listItems: string[] = [];
        let para: string[] = [];

        const flushList = () => {
          if (listItems.length) {
            elements.push(
              <ul key={`ul-${key++}`} className="list-disc pl-5 space-y-1">
                {listItems.map((li, i) => (
                  <li key={i}>{li}</li>
                ))}
              </ul>
            );
            listItems = [];
          }
        };

        const flushPara = () => {
          if (para.length) {
            elements.push(
              <p key={`p-${key++}`} className="leading-relaxed">
                {para.join(" ")}
              </p>
            );
            para = [];
          }
        };

        for (const line of lines) {
          const trimmed = line.trim();
          if (!trimmed) {
            flushList();
            flushPara();
            continue;
          }

          if (trimmed.startsWith("- ")) {
            flushPara();
            listItems.push(trimmed.substring(2));
          } else {
            flushList();
            para.push(trimmed);
          }
        }

        flushList();
        flushPara();
      }
    });

    return elements;
  };

  return (
    <div
      className={`p-3 rounded-2xl max-w-xl whitespace-pre-wrap break-words ${
        isUser
          ? "bg-blue-600 text-white self-end"
          : "bg-zinc-800 text-zinc-200 self-start"
      }`}
    >
      <div className="space-y-2">{renderContent(content)}</div>
    </div>
  );
}
