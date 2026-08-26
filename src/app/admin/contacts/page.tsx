'use client';

import { useState, useEffect } from 'react';
import {
  Mail,
  Phone,
  Building,
  Clock,
  Trash2,
  Eye,
  Archive,
  CheckCircle,
} from 'lucide-react';

interface Contact {
  _id: string;
  name: string;
  email: string;
  phone?: string;
  company?: string;
  service?: string;
  message: string;
  status: 'new' | 'read' | 'replied' | 'archived';
  createdAt: string;
}

export default function ContactsPage() {
  const [contacts, setContacts] = useState<Contact[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('all');
  const [selectedContact, setSelectedContact] = useState<Contact | null>(null);

  useEffect(() => {
    fetchContacts();
  }, [filter]);

  const fetchContacts = async () => {
    try {
      const res = await fetch(`/api/admin/contacts?status=${filter}`);
      const data = await res.json();
      setContacts(data.contacts || []);
    } catch (error) {
      console.error('Error fetching contacts:', error);
    } finally {
      setLoading(false);
    }
  };

  const updateStatus = async (id: string, status: string) => {
    try {
      await fetch(`/api/admin/contacts/${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status }),
      });
      fetchContacts();
    } catch (error) {
      console.error('Error updating contact:', error);
    }
  };

  const deleteContact = async (id: string) => {
    if (!confirm('Are you sure you want to delete this contact?')) return;
    try {
      await fetch(`/api/admin/contacts/${id}`, { method: 'DELETE' });
      fetchContacts();
      setSelectedContact(null);
    } catch (error) {
      console.error('Error deleting contact:', error);
    }
  };

  const statusColors = {
    new: 'bg-green-500/20 text-green-400',
    read: 'bg-[#06b6d4]/20 text-[#06b6d4]',
    replied: 'bg-purple-500/20 text-purple-400',
    archived: 'bg-slate-600/50 text-slate-400',
  };

  if (loading) {
    return (
      <div className="flex h-64 items-center justify-center">
        <div className="h-8 w-8 animate-spin rounded-full border-2 border-[#06b6d4]/30 border-t-[#06b6d4]" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-white">Contact Messages</h1>
          <p className="mt-1 text-slate-400">
            Manage inquiries from your contact form
          </p>
        </div>
      </div>

      {/* Filters */}
      <div className="flex gap-2">
        {['all', 'new', 'read', 'replied', 'archived'].map((status) => (
          <button
            key={status}
            onClick={() => setFilter(status)}
            className={`rounded-lg px-4 py-2 text-sm font-medium transition-colors ${
              filter === status
                ? 'bg-[#06b6d4] text-white'
                : 'border border-slate-700/50 bg-[#1E293B] text-slate-400 hover:text-white'
            }`}
          >
            {status.charAt(0).toUpperCase() + status.slice(1)}
          </button>
        ))}
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        {/* Contact List */}
        <div className="overflow-hidden rounded-xl border border-slate-700/50 bg-[#1E293B] lg:col-span-1">
          <div className="max-h-[600px] divide-y divide-slate-700/50 overflow-y-auto">
            {contacts.length === 0 ? (
              <div className="p-8 text-center text-slate-400">
                No contacts found
              </div>
            ) : (
              contacts.map((contact) => (
                <div
                  key={contact._id}
                  onClick={() => {
                    setSelectedContact(contact);
                    if (contact.status === 'new') {
                      updateStatus(contact._id, 'read');
                    }
                  }}
                  className={`cursor-pointer p-4 transition-colors hover:bg-slate-700/30 ${
                    selectedContact?._id === contact._id
                      ? 'bg-slate-700/50'
                      : ''
                  }`}
                >
                  <div className="mb-2 flex items-start justify-between">
                    <h3 className="font-medium text-white">{contact.name}</h3>
                    <span
                      className={`rounded-full px-2 py-1 text-xs ${statusColors[contact.status]}`}
                    >
                      {contact.status}
                    </span>
                  </div>
                  <p className="truncate text-sm text-slate-400">
                    {contact.message}
                  </p>
                  <p className="mt-2 text-xs text-slate-500">
                    {new Date(contact.createdAt).toLocaleDateString()}
                  </p>
                </div>
              ))
            )}
          </div>
        </div>

        {/* Contact Detail */}
        <div className="rounded-xl border border-slate-700/50 bg-[#1E293B] p-6 lg:col-span-2">
          {selectedContact ? (
            <div className="space-y-6">
              <div className="flex items-start justify-between">
                <div>
                  <h2 className="text-xl font-bold text-white">
                    {selectedContact.name}
                  </h2>
                  <span
                    className={`rounded-full px-2 py-1 text-xs ${statusColors[selectedContact.status]}`}
                  >
                    {selectedContact.status}
                  </span>
                </div>
                <div className="flex gap-2">
                  <button
                    onClick={() => updateStatus(selectedContact._id, 'replied')}
                    className="rounded-lg p-2 text-green-400 hover:bg-green-500/20"
                    title="Mark as Replied"
                  >
                    <CheckCircle className="h-5 w-5" />
                  </button>
                  <button
                    onClick={() =>
                      updateStatus(selectedContact._id, 'archived')
                    }
                    className="rounded-lg p-2 text-slate-400 hover:bg-slate-700"
                    title="Archive"
                  >
                    <Archive className="h-5 w-5" />
                  </button>
                  <button
                    onClick={() => deleteContact(selectedContact._id)}
                    className="rounded-lg p-2 text-red-400 hover:bg-red-500/20"
                    title="Delete"
                  >
                    <Trash2 className="h-5 w-5" />
                  </button>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="flex items-center gap-2 text-slate-400">
                  <Mail className="h-4 w-4" />
                  <a
                    href={`mailto:${selectedContact?.email ?? ''}`}
                    className="hover:text-[#06b6d4]"
                  >
                    {selectedContact.email}
                  </a>
                </div>
                {selectedContact.phone && (
                  <div className="flex items-center gap-2 text-slate-400">
                    <Phone className="h-4 w-4" />
                    <a
                      href={`tel:${selectedContact.phone}`}
                      className="hover:text-[#06b6d4]"
                    >
                      {selectedContact.phone}
                    </a>
                  </div>
                )}
                {selectedContact.company && (
                  <div className="flex items-center gap-2 text-slate-400">
                    <Building className="h-4 w-4" />
                    {selectedContact.company}
                  </div>
                )}
                <div className="flex items-center gap-2 text-slate-400">
                  <Clock className="h-4 w-4" />
                  {new Date(selectedContact.createdAt).toLocaleString()}
                </div>
              </div>

              {selectedContact.service && (
                <div>
                  <h4 className="mb-1 text-sm font-medium text-slate-500">
                    Service Interested
                  </h4>
                  <p className="text-white">{selectedContact.service}</p>
                </div>
              )}

              <div>
                <h4 className="mb-2 text-sm font-medium text-slate-500">
                  Message
                </h4>
                <div className="rounded-lg border border-slate-700 bg-[#0F172A] p-4">
                  <p className="whitespace-pre-wrap text-slate-300">
                    {selectedContact.message}
                  </p>
                </div>
              </div>

              <div className="flex gap-3">
                <a
                  href={`mailto:${selectedContact?.email ?? ''}?subject=Re: Your inquiry to Silicon Hubs`}
                  className="rounded-lg bg-[#06b6d4] px-4 py-2 text-white transition-colors hover:bg-[#06b6d4]/80"
                >
                  Reply via Email
                </a>
              </div>
            </div>
          ) : (
            <div className="flex h-64 items-center justify-center text-slate-500">
              Select a contact to view details
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
