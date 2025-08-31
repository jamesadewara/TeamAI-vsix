import React, { useEffect, useState, useRef } from "react";
import { useNavigation } from "../context/NavigationContext";
import { useAuth } from "../context/AuthContext";
import { ArrowLeft, Send, Plus, Users } from "lucide-react";
import { chatAPI } from "../api/chat";
import type { ChatThread, ChatMessage } from "../types";
import { CreateChatThreadModal } from "../components/CreateChatThreadModal";
import { useProjects } from "../context/ProjectContext";

export const Chat: React.FC = () => {
  const {  setCurrentView } = useNavigation();
  const { currentProject } = useProjects();
  const { user } = useAuth();
  const [threads, setThreads] = useState<ChatThread[]>([]);
  const [selectedThread, setSelectedThread] = useState<ChatThread | null>(null);
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [newMessage, setNewMessage] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (currentProject) {
      fetchThreads();
    }
  }, [currentProject]);

  useEffect(() => {
    if (selectedThread) {
      fetchMessages(selectedThread.id || "");
    }
  }, [selectedThread]);

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const fetchThreads = async () => {
    try {
      setLoading(true);
      const data = await chatAPI.getThreads(currentProject!.id.toString());
      setThreads(data);
      if (data.length > 0 && !selectedThread) {
        setSelectedThread(data[0]);
      }
    } catch (err: any) {
      setError(err.response?.data?.message || "Failed to fetch chat threads");
    } finally {
      setLoading(false);
    }
  };

  const fetchMessages = async (threadId: string) => {
    try {
      setLoading(true);
      const data = await chatAPI.getMessages(threadId.toString());
      setMessages(data);
    } catch (err: any) {
      setError(err.response?.data?.message || "Failed to fetch messages");
    } finally {
      setLoading(false);
    }
  };

  const sendMessage = async () => {
    if (!newMessage.trim() || !selectedThread) return;

    try {
      // Optimistically add the message
      const tempMessage: ChatMessage = {
        id: Date.now().toString(), // Temporary ID
        thread: selectedThread.id || "",
        sender_user: user!.id,
        sender_agent_role: null,
        sender_type: "human",
        content: newMessage,
        meta: {},
        action_refs: [],
        sender_details: user!,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      };

      setMessages([...messages, tempMessage]);
      setNewMessage("");

      // Send to API
      const sentMessage = await chatAPI.sendMessage(selectedThread.id || "", {
        content: newMessage,
      });

      // Replace temporary message with actual message from server
      setMessages((prev) =>
        prev.map((msg) => (msg.id === tempMessage.id ? sentMessage : msg))
      );
    } catch (err: any) {
      setError(err.response?.data?.message || "Failed to send message");
      // Remove the optimistic message on error
      setMessages((prev) =>
        prev.filter((msg) => msg.id !== Date.now().toString())
      );
    }
  };

  const askAI = async () => {
    if (!newMessage.trim() || !selectedThread) return;

    try {
      // Optimistically add the human message
      const tempMessage: ChatMessage = {
        id: Date.now().toString(), // Temporary ID
        thread: selectedThread.id || "",
        sender_user: user!.id,
        sender_agent_role: null,
        sender_type: "human",
        content: newMessage,
        meta: {},
        action_refs: [],
        sender_details: user!,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      };

      setMessages([...messages, tempMessage]);
      setNewMessage("");

      // Get AI response
      const aiResponse = await chatAPI.askAgent(
        selectedThread.id || "",
        newMessage
      );

      setMessages((prev) => [...prev, aiResponse]);
    } catch (err: any) {
      setError(err.response?.data?.message || "Failed to get AI response");
      // Remove the optimistic message on error
      setMessages((prev) =>
        prev.filter((msg) => msg.id !== Date.now().toString.toString())
      );
    }
  };

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  const createNewThread = async () => {
    setIsCreateModalOpen(true);
  };

  const handleThreadCreated = (newThread: ChatThread) => {
    setThreads([...threads, newThread]);
    setSelectedThread(newThread);
  };

  if (!currentProject) {
    setCurrentView("dashboard");
    return null;
  }

  return (
    <div className="min-h-screen bg-gray-100 flex">
      {/* Sidebar */}
      <div className="w-64 bg-white border-r border-gray-200 flex flex-col">
        <div className="p-4 border-b border-gray-200">
          <button
            onClick={createNewThread}
            className="w-full bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded flex items-center justify-center"
          >
            <Plus size={16} className="mr-2" />
            New Chat
          </button>
        </div>
        <div className="flex-1 overflow-y-auto">
          {threads.map((thread) => (
            <div
              key={thread.id}
              className={`p-4 border-b border-gray-200 cursor-pointer hover:bg-gray-50 ${
                selectedThread?.id === thread.id ? "bg-blue-50" : ""
              }`}
              onClick={() => setSelectedThread(thread)}
            >
              <h3 className="font-semibold">{thread.title}</h3>
              <div className="flex items-center text-sm text-gray-500 mt-1">
                <Users size={14} className="mr-1" />
                {thread.participant_count} participants
              </div>
              {thread.last_message && (
                <p className="text-sm text-gray-600 truncate mt-1">
                  {thread.last_message.content}
                </p>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Main Chat Area */}
      <div className="flex-1 flex flex-col">
        <header className="bg-white shadow">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center py-6">
            <button
              onClick={() => setCurrentView("project")}
              className="mr-4 text-gray-600 hover:text-gray-800"
            >
              <ArrowLeft size={24} />
            </button>
            <h1 className="text-3xl font-bold text-gray-900">
              Chat - {selectedThread?.title || "Select a thread"}
            </h1>
          </div>
        </header>
        <main className="flex-1 overflow-hidden flex flex-col">
          <div className="flex-1 overflow-y-auto p-4">
            <div className="max-w-4xl mx-auto">
              {error && (
                <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
                  {error}
                </div>
              )}
              {loading && messages.length === 0 ? (
                <div className="flex justify-center items-center h-32">
                  <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
                </div>
              ) : (
                <div className="space-y-4">
                  {messages.map((message) => (
                    <div
                      key={message.id}
                      className={`flex ${
                        message.sender_type === "human"
                          ? "justify-end"
                          : "justify-start"
                      }`}
                    >
                      <div
                        className={`max-w-xs md:max-w-md lg:max-w-lg rounded-lg p-4 ${
                          message.sender_type === "human"
                            ? "bg-blue-500 text-white"
                            : message.sender_type === "agent"
                            ? "bg-green-500 text-white"
                            : "bg-gray-200 text-gray-800"
                        }`}
                      >
                        <p>{message.content}</p>
                        <p
                          className={`text-xs mt-1 ${
                            message.sender_type === "human"
                              ? "text-blue-100"
                              : message.sender_type === "agent"
                              ? "text-green-100"
                              : "text-gray-500"
                          }`}
                        >
                          {message.sender_type === "human"
                            ? "You"
                            : message.sender_type === "agent"
                            ? "AI Assistant"
                            : "System"}{" "}
                          • {new Date(message.created_at).toLocaleTimeString()}
                        </p>
                      </div>
                    </div>
                  ))}
                  <div ref={messagesEndRef} />
                </div>
              )}
            </div>
          </div>
          <div className="bg-white border-t p-4">
            <div className="max-w-4xl mx-auto flex">
              <textarea
                value={newMessage}
                onChange={(e) => setNewMessage(e.target.value)}
                onKeyPress={handleKeyPress}
                placeholder="Type your message..."
                className="flex-1 border rounded-l-lg p-3 resize-none focus:outline-none focus:ring-2 focus:ring-blue-500"
                rows={1}
              />
              <button
                onClick={sendMessage}
                disabled={!newMessage.trim()}
                className="bg-blue-500 text-white px-4 py-2 disabled:opacity-50"
              >
                <Send size={20} />
              </button>
              <button
                onClick={askAI}
                disabled={!newMessage.trim()}
                className="bg-green-500 text-white px-4 py-2 rounded-r-lg disabled:opacity-50"
              >
                Ask AI
              </button>
            </div>
          </div>
        </main>
      </div>
      <CreateChatThreadModal
        isOpen={isCreateModalOpen}
        onClose={() => setIsCreateModalOpen(false)}
        onThreadCreated={handleThreadCreated}
      />
    </div>
  );
};
