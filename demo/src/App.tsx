import { useState } from 'react';
import { SortableList, SortableItem, DragHandle } from 'sortiva';
import { Check, Copy } from 'lucide-react';

const CopyButton = ({ text }: { text: string }) => {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    await navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <button
      onClick={handleCopy}
      className="absolute top-4 right-4 p-2 rounded-lg bg-white/10 hover:bg-white/20 text-slate-400 hover:text-white transition-all border border-white/10"
      title="Copy to clipboard"
    >
      {copied ? <Check className="w-4 h-4 text-green-400" /> : <Copy className="w-4 h-4" />}
    </button>
  );
};

function App() {
  const [tasks, setTasks] = useState([
    { id: 't1', title: 'Design Database Schema', status: 'In Progress' },
    { id: 't2', title: 'Implement Auth API', status: 'To Do' },
    { id: 't3', title: 'Build React UI', status: 'To Do' },
    { id: 't4', title: 'Write Documentation', status: 'Done' },
  ]);

  const [cards, setCards] = useState([
    { id: 'c1', title: 'Premium Plan', price: '$29/mo' },
    { id: 'c2', title: 'Standard Plan', price: '$19/mo' },
    { id: 'c3', title: 'Basic Plan', price: '$9/mo' },
  ]);

  return (
    <div className="min-h-screen p-8 max-w-4xl mx-auto space-y-16">
      <div className="text-center space-y-4">
        <h1 className="text-5xl font-extrabold tracking-tight text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-purple-600">
          Sortiva Demo
        </h1>
        <p className="text-lg text-slate-500 max-w-2xl mx-auto">
          A powerful and flexible drag-and-drop sortable list for React. Try reordering the items below using different handle configurations!
        </p>
        <div className="flex items-center justify-center gap-4 text-sm font-medium text-slate-600">
          <span>By Rahul Roy Nipon</span>
          <span>•</span>
          <a href="mailto:rahulroynipon@gmail.com" className="text-blue-600 hover:underline">rahulroynipon@gmail.com</a>
          <span>•</span>
          <a href="https://github.com/rahulroynipon/sortiva" target="_blank" rel="noreferrer" className="text-blue-600 hover:underline">Repository</a>
          <span>•</span>
          <a href="https://github.com/rahulroynipon" target="_blank" rel="noreferrer" className="text-blue-600 hover:underline">GitHub</a>
          <span>•</span>
          <a href="https://linkedin.com/in/rahulroynipon" target="_blank" rel="noreferrer" className="text-blue-600 hover:underline">LinkedIn</a>
        </div>
      </div>

      {/* Example 1: Standard List with Custom Handle */}
      <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-8">
        <h2 className="text-2xl font-bold mb-2">1. Task List</h2>
        <p className="text-slate-500 mb-6 font-medium text-sm">Targeted drag handle (try dragging the grip icon)</p>
        
        <SortableList
          items={tasks}
          getId={(t) => t.id}
          onOrderChange={setTasks}
          className="space-y-5"
          renderItem={(item) => (
            <SortableItem 
              id={item.id} 
              className="group flex flex-col sm:flex-row sm:items-center gap-4 p-4 rounded-xl border border-slate-200 bg-white hover:border-blue-300 hover:shadow-md transition-all sm:justify-between"
            >
              <div className="flex items-center gap-4">
                {/* Custom Styled Handle */}
                <DragHandle 
                  className="hover:bg-slate-100 rounded-lg p-2 text-slate-400 group-hover:text-blue-500 transition-colors"
                />
                <div>
                  <h3 className="font-semibold text-slate-800">{item.title}</h3>
                  <span className="text-xs font-medium px-2.5 py-1 inline-block mt-1 rounded-full bg-slate-100 text-slate-600">
                    {item.status}
                  </span>
                </div>
              </div>
            </SortableItem>
          )}
        />
      </div>

      {/* Example 2: Entire Item is Draggable */}
      <div className="bg-slate-50 rounded-2xl p-8 border border-slate-200">
        <h2 className="text-2xl font-bold mb-2">2. Pricing Cards</h2>
        <p className="text-slate-500 mb-6 font-medium text-sm">Entire element is draggable (try grabbing anywhere)</p>

        <SortableList
          items={cards}
          getId={(c) => c.id}
          onOrderChange={setCards}
          className="grid gap-6 sm:grid-cols-3"
          renderItem={(item) => (
            <SortableItem 
              id={item.id} 
              asHandle 
              className="w-full flex flex-col justify-center items-center p-6 text-center rounded-2xl bg-white shadow-sm border-2 border-transparent hover:border-purple-300 hover:shadow-lg transition-all cursor-grab active:cursor-grabbing hover:-translate-y-1"
            >
              <h3 className="font-bold text-lg text-slate-800 mb-2">{item.title}</h3>
              <div className="text-3xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-purple-500 to-pink-500">
                {item.price}
              </div>
            </SortableItem>
          )}
        />
      </div>

      {/* Example 3: Code Snippet */}
      <div className="bg-slate-900 rounded-2xl shadow-sm border border-slate-800 p-8 text-slate-300 overflow-hidden">
        <h2 className="text-2xl font-bold mb-2 text-white">3. How to Use</h2>
        <p className="text-slate-400 mb-6 font-medium text-sm">Install the package and use it in your React app.</p>
        
        <div className="space-y-6">
          <div className="relative group">
            <CopyButton text="npm install sortiva" />
            <pre className="p-4 rounded-xl bg-black/50 text-sm font-mono border border-slate-800 shadow-inner">
              <code className="text-blue-300">npm install sortiva</code>
            </pre>
          </div>

          <div className="relative group">
            <CopyButton text={`import { SortableList, SortableItem, DragHandle } from 'sortiva';\n\n<SortableList\n  items={myArray}\n  getId={(item) => item.id}\n  onOrderChange={setMyArray}\n  renderItem={(item) => (\n    <SortableItem id={item.id}>\n      <DragHandle />\n      <span>{item.name}</span>\n    </SortableItem>\n  )}\n/>`} />
            <pre className="p-6 rounded-xl bg-black/50 overflow-x-auto text-sm font-mono border border-slate-800 shadow-inner">
              <code className="text-pink-400">import</code> <code className="text-slate-300">{"{ SortableList, SortableItem, DragHandle }"}</code> <code className="text-pink-400">from</code> <code className="text-green-300">'sortiva'</code><code className="text-slate-300">;</code>
              <br /><br />
              <code className="text-slate-300">{"<"}<span className="text-blue-400">SortableList</span></code><br />
              <code className="text-slate-300">  items={"{"}myArray{"}"}</code><br />
              <code className="text-slate-300">  getId={"{"}(item) {">"} item.id{"}"}</code><br />
              <code className="text-slate-300">  onOrderChange={"{"}setMyArray{"}"}</code><br />
              <code className="text-slate-300">  renderItem={"{"}(item) {">"} (</code><br />
              <code className="text-slate-300">    {"<"}<span className="text-blue-400">SortableItem</span> id={"{"}item.id{"}"}{">"}</code><br />
              <code className="text-slate-300">      {"<"}<span className="text-blue-400">DragHandle</span> {"/>"}</code><br />
              <code className="text-slate-300">      {"<span"}{">"}{"{"}item.name{"}"}{"</span"}{">"}</code><br />
              <code className="text-slate-300">    {"</"}<span className="text-blue-400">SortableItem</span>{">"}</code><br />
              <code className="text-slate-300">  ){"}"}</code><br />
              <code className="text-slate-300">{"/>"}</code>
            </pre>
          </div>
        </div>
      </div>
    </div>
  );
}

export default App;
