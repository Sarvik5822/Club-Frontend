import { useState, useEffect } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { Send, Search, RefreshCw, Plus, Inbox, ArrowUpRight, Mail, MailOpen } from 'lucide-react';
import memberService from '@/services/memberService';
import { toast } from 'sonner';

export default function Messages() {
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedMessage, setSelectedMessage] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [messageType, setMessageType] = useState('inbox');
  const [showComposeModal, setShowComposeModal] = useState(false);
  const [sending, setSending] = useState(false);
  const [compose, setCompose] = useState({ recipientId: '', subject: '', message: '' });

  const fetchMessages = async () => {
    try {
      setLoading(true);
      const res = await memberService.getMessages({ type: messageType });
      setMessages(res.data?.messages || []);
    } catch (error) {
      toast.error('Failed to load messages: ' + error.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMessages();
    setSelectedMessage(null);
  }, [messageType]);

  const handleSelectMessage = async (msg) => {
    setSelectedMessage(msg);
    // Mark as read if it's an unread inbox message
    if (messageType === 'inbox' && !msg.isRead) {
      try {
        await memberService.markMessageAsRead(msg._id);
        setMessages(prev => prev.map(m => m._id === msg._id ? { ...m, isRead: true } : m));
      } catch {
        // silent fail
      }
    }
  };

  const handleSendMessage = async () => {
    if (!compose.recipientId || !compose.subject || !compose.message) {
      toast.error('Please fill in all fields');
      return;
    }
    try {
      setSending(true);
      await memberService.sendMessage(compose);
      toast.success('Message sent successfully!');
      setShowComposeModal(false);
      setCompose({ recipientId: '', subject: '', message: '' });
      if (messageType === 'sent') fetchMessages();
    } catch (error) {
      toast.error('Failed to send message: ' + error.message);
    } finally {
      setSending(false);
    }
  };

  const filteredMessages = messages.filter(msg =>
    msg.subject?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    msg.sender?.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    msg.recipient?.name?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const getDisplayName = (msg) => {
    if (messageType === 'inbox') return msg.sender?.name || 'Unknown';
    return msg.recipient?.name || 'Unknown';
  };

  const getAvatar = (msg) => {
    const person = messageType === 'inbox' ? msg.sender : msg.recipient;
    return person?.avatar || `https://api.dicebear.com/7.x/avataaars/svg?seed=${person?.name || 'user'}`;
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Messages</h1>
          <p className="text-muted-foreground mt-1">Communicate with coaches and staff</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" onClick={fetchMessages} disabled={loading}>
            <RefreshCw className={`h-4 w-4 mr-2 ${loading ? 'animate-spin' : ''}`} />
            Refresh
          </Button>
          <Button onClick={() => setShowComposeModal(true)}>
            <Plus className="h-4 w-4 mr-2" />
            Compose
          </Button>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex gap-2">
        <Button
          variant={messageType === 'inbox' ? 'default' : 'outline'}
          onClick={() => setMessageType('inbox')}
          className="flex items-center gap-2"
        >
          <Inbox className="h-4 w-4" />
          Inbox
          {messages.filter(m => !m.isRead && messageType === 'inbox').length > 0 && (
            <Badge className="ml-1 bg-red-500 text-white text-xs px-1.5">
              {messages.filter(m => !m.isRead).length}
            </Badge>
          )}
        </Button>
        <Button
          variant={messageType === 'sent' ? 'default' : 'outline'}
          onClick={() => setMessageType('sent')}
          className="flex items-center gap-2"
        >
          <ArrowUpRight className="h-4 w-4" />
          Sent
        </Button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Message List */}
        <Card className="lg:col-span-1">
          <CardContent className="p-4">
            <div className="relative mb-4">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
              <Input
                placeholder="Search messages..."
                className="pl-10"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>

            {loading ? (
              <div className="space-y-3">
                {[1, 2, 3, 4].map(i => (
                  <div key={i} className="flex gap-3 p-3">
                    <Skeleton className="w-10 h-10 rounded-full flex-shrink-0" />
                    <div className="flex-1 space-y-2">
                      <Skeleton className="h-4 w-3/4" />
                      <Skeleton className="h-3 w-full" />
                    </div>
                  </div>
                ))}
              </div>
            ) : filteredMessages.length === 0 ? (
              <div className="text-center py-8 text-muted-foreground">
                <Mail className="h-8 w-8 mx-auto mb-2" />
                <p className="text-sm">No messages found</p>
              </div>
            ) : (
              <div className="space-y-1 max-h-[500px] overflow-y-auto">
                {filteredMessages.map((message) => (
                  <div
                    key={message._id}
                    onClick={() => handleSelectMessage(message)}
                    className={`p-3 rounded-lg cursor-pointer transition-colors ${selectedMessage?._id === message._id
                        ? 'bg-primary/10 border border-primary/20'
                        : 'hover:bg-gray-100 dark:hover:bg-gray-800'
                      }`}
                  >
                    <div className="flex items-start gap-3">
                      <img
                        src={getAvatar(message)}
                        alt={getDisplayName(message)}
                        className="w-10 h-10 rounded-full flex-shrink-0"
                        onError={(e) => { e.target.src = `https://api.dicebear.com/7.x/avataaars/svg?seed=user`; }}
                      />
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between gap-1">
                          <p className={`text-sm truncate ${!message.isRead && messageType === 'inbox' ? 'font-semibold' : 'font-medium'}`}>
                            {getDisplayName(message)}
                          </p>
                          {!message.isRead && messageType === 'inbox' && (
                            <div className="h-2 w-2 rounded-full bg-blue-500 flex-shrink-0" />
                          )}
                        </div>
                        <p className="text-xs text-muted-foreground truncate">{message.subject}</p>
                        <p className="text-xs text-muted-foreground mt-1">
                          {new Date(message.createdAt).toLocaleDateString()}
                        </p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>

        {/* Message Detail */}
        <Card className="lg:col-span-2">
          <CardContent className="p-6">
            {selectedMessage ? (
              <div className="space-y-4">
                <div className="flex items-start gap-4 pb-4 border-b">
                  <img
                    src={getAvatar(selectedMessage)}
                    alt={getDisplayName(selectedMessage)}
                    className="w-12 h-12 rounded-full"
                    onError={(e) => { e.target.src = `https://api.dicebear.com/7.x/avataaars/svg?seed=user`; }}
                  />
                  <div className="flex-1">
                    <div className="flex items-center gap-2">
                      <h3 className="font-semibold">{getDisplayName(selectedMessage)}</h3>
                      {selectedMessage.isRead ? (
                        <MailOpen className="h-4 w-4 text-muted-foreground" />
                      ) : (
                        <Mail className="h-4 w-4 text-blue-500" />
                      )}
                    </div>
                    <p className="text-sm text-muted-foreground">
                      {new Date(selectedMessage.createdAt).toLocaleString()}
                    </p>
                  </div>
                </div>
                <div>
                  <h4 className="font-semibold text-lg mb-2">{selectedMessage.subject}</h4>
                  <p className="text-muted-foreground whitespace-pre-wrap">{selectedMessage.content}</p>
                </div>
                {messageType === 'inbox' && (
                  <div className="pt-4 border-t">
                    <p className="text-sm font-medium mb-2">Reply</p>
                    <Textarea
                      placeholder="Type your reply..."
                      className="mb-2"
                      id="reply-textarea"
                    />
                    <Button onClick={async () => {
                      const replyText = document.getElementById('reply-textarea').value;
                      if (!replyText.trim()) { toast.error('Please enter a reply'); return; }
                      try {
                        setSending(true);
                        await memberService.sendMessage({
                          recipientId: selectedMessage.sender?._id,
                          subject: `Re: ${selectedMessage.subject}`,
                          message: replyText,
                        });
                        toast.success('Reply sent!');
                        document.getElementById('reply-textarea').value = '';
                      } catch (error) {
                        toast.error('Failed to send reply: ' + error.message);
                      } finally {
                        setSending(false);
                      }
                    }} disabled={sending}>
                      <Send className="h-4 w-4 mr-2" />
                      {sending ? 'Sending...' : 'Send Reply'}
                    </Button>
                  </div>
                )}
              </div>
            ) : (
              <div className="h-96 flex flex-col items-center justify-center text-muted-foreground">
                <Mail className="h-12 w-12 mb-4" />
                <p>Select a message to view</p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Compose Modal */}
      <Dialog open={showComposeModal} onOpenChange={setShowComposeModal}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>New Message</DialogTitle>
            <DialogDescription>Send a message to a coach or staff member</DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label>Recipient ID</Label>
              <Input
                placeholder="Enter recipient user ID"
                value={compose.recipientId}
                onChange={(e) => setCompose(prev => ({ ...prev, recipientId: e.target.value }))}
              />
              <p className="text-xs text-muted-foreground">Enter the user ID of the coach or staff member</p>
            </div>
            <div className="space-y-2">
              <Label>Subject</Label>
              <Input
                placeholder="Message subject"
                value={compose.subject}
                onChange={(e) => setCompose(prev => ({ ...prev, subject: e.target.value }))}
              />
            </div>
            <div className="space-y-2">
              <Label>Message</Label>
              <Textarea
                placeholder="Write your message..."
                rows={5}
                value={compose.message}
                onChange={(e) => setCompose(prev => ({ ...prev, message: e.target.value }))}
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowComposeModal(false)}>Cancel</Button>
            <Button onClick={handleSendMessage} disabled={sending}>
              <Send className="h-4 w-4 mr-2" />
              {sending ? 'Sending...' : 'Send Message'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}