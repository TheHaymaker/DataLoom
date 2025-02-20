# frozen_string_literal: true
# Generated by the protocol buffer compiler.  DO NOT EDIT!
# source: events.proto

require 'google/protobuf'


descriptor_data = "\n\x0c\x65vents.proto\x12\x06sample\"\xd7\x01\n\x05\x45vent\x12\x10\n\x08\x65vent_id\x18\x01 \x01(\t\x12\x11\n\ttimestamp\x18\x02 \x01(\x03\x12\x14\n\x0c\x61ggregate_id\x18\x03 \x01(\t\x12+\n\x0cuser_created\x18\x04 \x01(\x0b\x32\x13.sample.UserCreatedH\x00\x12+\n\x0cuser_updated\x18\x05 \x01(\x0b\x32\x13.sample.UserUpdatedH\x00\x12+\n\x0cuser_deleted\x18\x06 \x01(\x0b\x32\x13.sample.UserDeletedH\x00\x42\x0c\n\nevent_type\".\n\x0bUserCreated\x12\r\n\x05\x65mail\x18\x01 \x01(\t\x12\x10\n\x08username\x18\x02 \x01(\t\"\x83\x01\n\x0bUserUpdated\x12>\n\x0e\x63hanged_fields\x18\x01 \x03(\x0b\x32&.sample.UserUpdated.ChangedFieldsEntry\x1a\x34\n\x12\x43hangedFieldsEntry\x12\x0b\n\x03key\x18\x01 \x01(\t\x12\r\n\x05value\x18\x02 \x01(\t:\x02\x38\x01\"\x1d\n\x0bUserDeleted\x12\x0e\n\x06reason\x18\x01 \x01(\tb\x06proto3"

pool = Google::Protobuf::DescriptorPool.generated_pool
pool.add_serialized_file(descriptor_data)

module Sample
  Event = ::Google::Protobuf::DescriptorPool.generated_pool.lookup("sample.Event").msgclass
  UserCreated = ::Google::Protobuf::DescriptorPool.generated_pool.lookup("sample.UserCreated").msgclass
  UserUpdated = ::Google::Protobuf::DescriptorPool.generated_pool.lookup("sample.UserUpdated").msgclass
  UserDeleted = ::Google::Protobuf::DescriptorPool.generated_pool.lookup("sample.UserDeleted").msgclass
end
