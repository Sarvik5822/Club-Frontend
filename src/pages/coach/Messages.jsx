import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Search, Send, Paperclip, MoreVertical } from 'lucide-react';
import coachService from '@/services/coachService';
import { toast } from 'sonner';

export default function CoachMessages() {
  const [conversations, setConversations] = useState([]);
  const [messages, setMessages] = useState([]);
  const [selectedConversation, setSelectedConversation] = useState(null);
  const [messageText, setMessageText] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchMessages();
  }, []);

  const fetchMessages = async () => {
    try {
      setLoading(true);
      const response = await coachService.getMessages({ type: 'inbox' });
      if (response.status === 'success') {
        // Group messages by sender to create conversations
        const messagesData = response.data.messages || [];
        const conversationsMap = new Map();

        messagesData.forEach(msg => {
          const otherUser = msg.sender._id !== msg.recipient._id ? msg.sender : msg.recipient;
          const key = otherUser._id;

          if (!conversationsMap.has(key)) {
            conversationsMap.set(key, {
              id: key,
              name: otherUser.name,
              avatar: otherUser.avatar,
              lastMessage: msg.content,
              timestamp: new Date(msg.createdAt).toLocaleString(),
              unread: msg.isRead ? 0 : 1,
              messages: []
            });
          }

          conversationsMap.get(key).messages.push(msg);
        });

        setConversations(Array.from(conversationsMap.values()));
      }
    } catch (error) {
      console.error('Error fetching messages:', error);
      toast.error('Failed to load messages');
    } finally {
      setLoading(false);
    }
  };

  const handleSelectConversation = async (conversationId) => {
    setSelectedConversation(conversationId);
    const conversation = conversations.find(c => c.id === conversationId);
    if (conversation) {
      setMessages(conversation.messages.map(msg => ({
        id: msg._id,
        sender: msg.sender._id === conversationId ? 'client' : 'coach',
        text: msg.content,
        timestamp: new Date(msg.createdAt).toLocaleTimeString()
      })));

      // Mark messages as read
      conversation.messages.forEach(async (msg) => {
        if (!msg.isRead) {
          try {
            await coachService.markMessageAsRead(msg._id);
          } catch (error) {
            console.error('Error marking message as read:', error);
          }
        }
      });
    }
  };

  const handleSendMessage = async () => {
    if (messageText.trim() && selectedConversation) {
      try {
        const response = await coachService.sendMessage({
          recipientId: selectedConversation,
          subject: 'Message',
          message: messageText
        });

        if (response.status === 'success') {
          setMessages([...messages, {
            id: response.data.message._id,
            sender: 'coach',
            text: messageText,
            timestamp: new Date().toLocaleTimeString()
          }]);
          setMessageText('');
          toast.success('Message sent successfully');
        }
      } catch (error) {
        console.error('Error sending message:', error);
        toast.error('Failed to send message');
      }
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600 mx-auto"></div>
          <p className="mt-4 text-muted-foreground">Loading messages...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Messages</h1>
        <p className="text-muted-foreground mt-1">Communicate with your clients</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 h-[calc(100vh-250px)]">
        {/* Conversations List */}
        <Card className="lg:col-span-1">
          <CardHeader>
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search conversations..."
                className="pl-10"
              />
            </div>
          </CardHeader>
          <CardContent className="p-0">
            {conversations.length > 0 ? (
              <div className="space-y-1">
                {conversations.map((conversation) => (
                  <div
                    key={conversation.id}
                    onClick={() => handleSelectConversation(conversation.id)}
                    className={`flex items-center gap-3 p-4 cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-900 transition-colors ${selectedConversation === conversation.id ? 'bg-primary-50 dark:bg-primary-950' : ''
                      }`}
                  >
                    <Avatar>
                      <AvatarImage src={conversation.avatar || `https://api.dicebear.com/7.x/avataaars/svg?seed=${conversation.name}`} alt={conversation.name} />
                      <AvatarFallback>{conversation.name.split(' ').map(n => n[0]).join('')}</AvatarFallback>
                    </Avatar>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between mb-1">
                        <h4 className="font-semibold truncate">{conversation.name}</h4>
                        {conversation.unread > 0 && (
                          <Badge className="bg-primary-600 text-white">{conversation.unread}</Badge>
                        )}
                      </div>
                      <p className="text-sm text-muted-foreground truncate">{conversation.lastMessage}</p>
                      <p className="text-xs text-muted-foreground mt-1">{conversation.timestamp}</p>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="p-8 text-center text-muted-foreground">
                <p>No conversations yet</p>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Message Thread */}
        <Card className="lg:col-span-2 flex flex-col">
          {selectedConversation ? (
            <>
              <CardHeader className="border-b">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <Avatar>
                      <AvatarImage
                        src={conversations.find(c => c.id === selectedConversation)?.avatar}
                        alt={conversations.find(c => c.id === selectedConversation)?.name}
                      />
                      <AvatarFallback>
                        {conversations.find(c => c.id === selectedConversation)?.name.split(' ').map(n => n[0]).join('')}
                      </AvatarFallback>
                    </Avatar>
                    <div>
                      <h3 className="font-semibold">
                        {conversations.find(c => c.id === selectedConversation)?.name}
                      </h3>
                      <p className="text-xs text-muted-foreground">Active now</p>
                    </div>
                  </div>
                  <Button variant="ghost" size="icon">
                    <MoreVertical className="h-4 w-4" />
                  </Button>
                </div>
              </CardHeader>

              <CardContent className="flex-1 overflow-y-auto p-6 space-y-4">
                {messages.map((message) => (
                  <div
                    key={message.id}
                    className={`flex ${message.sender === 'coach' ? 'justify-end' : 'justify-start'}`}
                  >
                    <div
                      className={`max-w-[70%] rounded-lg p-3 ${message.sender === 'coach'
                          ? 'bg-primary-600 text-white'
                          : 'bg-gray-100 dark:bg-gray-800'
                        }`}
                    >
                      <p className="text-sm">{message.text}</p>
                      <p className={`text-xs mt-1 ${message.sender === 'coach' ? 'text-primary-100' : 'text-muted-foreground'
                        }`}>
                        {message.timestamp}
                      </p>
                    </div>
                  </div>
                ))}
              </CardContent>

              <div className="border-t p-4">
                <div className="flex items-end gap-2">
                  <Button variant="ghost" size="icon">
                    <Paperclip className="h-4 w-4" />
                  </Button>
                  <Textarea
                    placeholder="Type your message..."
                    value={messageText}
                    onChange={(e) => setMessageText(e.target.value)}
                    onKeyPress={(e) => {
                      if (e.key === 'Enter' && !e.shiftKey) {
                        e.preventDefault();
                        handleSendMessage();
                      }
                    }}
                    rows={2}
                    className="resize-none"
                  />
                  <Button onClick={handleSendMessage}>
                    <Send className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </>
          ) : (
            <CardContent className="flex-1 flex items-center justify-center">
              <div className="text-center text-muted-foreground">
                <p>Select a conversation to start messaging</p>
              </div>
            </CardContent>
          )}
        </Card>
      </div>
    </div>
  );
}