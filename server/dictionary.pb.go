// Code generated by protoc-gen-go. DO NOT EDIT.
// versions:
// 	protoc-gen-go v1.31.0
// 	protoc        v4.25.1
// source: dictionary.proto

package main

import (
	protoreflect "google.golang.org/protobuf/reflect/protoreflect"
	protoimpl "google.golang.org/protobuf/runtime/protoimpl"
	reflect "reflect"
	sync "sync"
)

const (
	// Verify that this generated code is sufficiently up-to-date.
	_ = protoimpl.EnforceVersion(20 - protoimpl.MinVersion)
	// Verify that runtime/protoimpl is sufficiently up-to-date.
	_ = protoimpl.EnforceVersion(protoimpl.MaxVersion - 20)
)

type Entry struct {
	state         protoimpl.MessageState
	sizeCache     protoimpl.SizeCache
	unknownFields protoimpl.UnknownFields

	Traditional *string  `protobuf:"bytes,1,opt,name=traditional" json:"traditional,omitempty"`
	Simplified  *string  `protobuf:"bytes,2,opt,name=simplified" json:"simplified,omitempty"`
	Pinyin      *string  `protobuf:"bytes,3,opt,name=pinyin" json:"pinyin,omitempty"`
	Definitions []string `protobuf:"bytes,4,rep,name=definitions" json:"definitions,omitempty"`
	Tags        []string `protobuf:"bytes,5,rep,name=tags" json:"tags,omitempty"`
	Examples    []string `protobuf:"bytes,6,rep,name=examples" json:"examples,omitempty"`
	Percentile  *int32   `protobuf:"varint,7,opt,name=percentile" json:"percentile,omitempty"`
	Contains    []string `protobuf:"bytes,8,rep,name=contains" json:"contains,omitempty"`
	Partof      []string `protobuf:"bytes,9,rep,name=partof" json:"partof,omitempty"`
	Related     []string `protobuf:"bytes,10,rep,name=related" json:"related,omitempty"`
}

func (x *Entry) Reset() {
	*x = Entry{}
	if protoimpl.UnsafeEnabled {
		mi := &file_dictionary_proto_msgTypes[0]
		ms := protoimpl.X.MessageStateOf(protoimpl.Pointer(x))
		ms.StoreMessageInfo(mi)
	}
}

func (x *Entry) String() string {
	return protoimpl.X.MessageStringOf(x)
}

func (*Entry) ProtoMessage() {}

func (x *Entry) ProtoReflect() protoreflect.Message {
	mi := &file_dictionary_proto_msgTypes[0]
	if protoimpl.UnsafeEnabled && x != nil {
		ms := protoimpl.X.MessageStateOf(protoimpl.Pointer(x))
		if ms.LoadMessageInfo() == nil {
			ms.StoreMessageInfo(mi)
		}
		return ms
	}
	return mi.MessageOf(x)
}

// Deprecated: Use Entry.ProtoReflect.Descriptor instead.
func (*Entry) Descriptor() ([]byte, []int) {
	return file_dictionary_proto_rawDescGZIP(), []int{0}
}

func (x *Entry) GetTraditional() string {
	if x != nil && x.Traditional != nil {
		return *x.Traditional
	}
	return ""
}

func (x *Entry) GetSimplified() string {
	if x != nil && x.Simplified != nil {
		return *x.Simplified
	}
	return ""
}

func (x *Entry) GetPinyin() string {
	if x != nil && x.Pinyin != nil {
		return *x.Pinyin
	}
	return ""
}

func (x *Entry) GetDefinitions() []string {
	if x != nil {
		return x.Definitions
	}
	return nil
}

func (x *Entry) GetTags() []string {
	if x != nil {
		return x.Tags
	}
	return nil
}

func (x *Entry) GetExamples() []string {
	if x != nil {
		return x.Examples
	}
	return nil
}

func (x *Entry) GetPercentile() int32 {
	if x != nil && x.Percentile != nil {
		return *x.Percentile
	}
	return 0
}

func (x *Entry) GetContains() []string {
	if x != nil {
		return x.Contains
	}
	return nil
}

func (x *Entry) GetPartof() []string {
	if x != nil {
		return x.Partof
	}
	return nil
}

func (x *Entry) GetRelated() []string {
	if x != nil {
		return x.Related
	}
	return nil
}

type Dictionary struct {
	state         protoimpl.MessageState
	sizeCache     protoimpl.SizeCache
	unknownFields protoimpl.UnknownFields

	// TODO: also add the date each data source was last updated.
	Entries []*Entry `protobuf:"bytes,1,rep,name=entries" json:"entries,omitempty"`
}

func (x *Dictionary) Reset() {
	*x = Dictionary{}
	if protoimpl.UnsafeEnabled {
		mi := &file_dictionary_proto_msgTypes[1]
		ms := protoimpl.X.MessageStateOf(protoimpl.Pointer(x))
		ms.StoreMessageInfo(mi)
	}
}

func (x *Dictionary) String() string {
	return protoimpl.X.MessageStringOf(x)
}

func (*Dictionary) ProtoMessage() {}

func (x *Dictionary) ProtoReflect() protoreflect.Message {
	mi := &file_dictionary_proto_msgTypes[1]
	if protoimpl.UnsafeEnabled && x != nil {
		ms := protoimpl.X.MessageStateOf(protoimpl.Pointer(x))
		if ms.LoadMessageInfo() == nil {
			ms.StoreMessageInfo(mi)
		}
		return ms
	}
	return mi.MessageOf(x)
}

// Deprecated: Use Dictionary.ProtoReflect.Descriptor instead.
func (*Dictionary) Descriptor() ([]byte, []int) {
	return file_dictionary_proto_rawDescGZIP(), []int{1}
}

func (x *Dictionary) GetEntries() []*Entry {
	if x != nil {
		return x.Entries
	}
	return nil
}

type Character struct {
	state         protoimpl.MessageState
	sizeCache     protoimpl.SizeCache
	unknownFields protoimpl.UnknownFields

	Traditional *string `protobuf:"bytes,1,opt,name=traditional" json:"traditional,omitempty"`
	Simplified  *string `protobuf:"bytes,2,opt,name=simplified" json:"simplified,omitempty"`
	Pinyin      *string `protobuf:"bytes,3,opt,name=pinyin" json:"pinyin,omitempty"`
}

func (x *Character) Reset() {
	*x = Character{}
	if protoimpl.UnsafeEnabled {
		mi := &file_dictionary_proto_msgTypes[2]
		ms := protoimpl.X.MessageStateOf(protoimpl.Pointer(x))
		ms.StoreMessageInfo(mi)
	}
}

func (x *Character) String() string {
	return protoimpl.X.MessageStringOf(x)
}

func (*Character) ProtoMessage() {}

func (x *Character) ProtoReflect() protoreflect.Message {
	mi := &file_dictionary_proto_msgTypes[2]
	if protoimpl.UnsafeEnabled && x != nil {
		ms := protoimpl.X.MessageStateOf(protoimpl.Pointer(x))
		if ms.LoadMessageInfo() == nil {
			ms.StoreMessageInfo(mi)
		}
		return ms
	}
	return mi.MessageOf(x)
}

// Deprecated: Use Character.ProtoReflect.Descriptor instead.
func (*Character) Descriptor() ([]byte, []int) {
	return file_dictionary_proto_rawDescGZIP(), []int{2}
}

func (x *Character) GetTraditional() string {
	if x != nil && x.Traditional != nil {
		return *x.Traditional
	}
	return ""
}

func (x *Character) GetSimplified() string {
	if x != nil && x.Simplified != nil {
		return *x.Simplified
	}
	return ""
}

func (x *Character) GetPinyin() string {
	if x != nil && x.Pinyin != nil {
		return *x.Pinyin
	}
	return ""
}

var File_dictionary_proto protoreflect.FileDescriptor

var file_dictionary_proto_rawDesc = []byte{
	0x0a, 0x10, 0x64, 0x69, 0x63, 0x74, 0x69, 0x6f, 0x6e, 0x61, 0x72, 0x79, 0x2e, 0x70, 0x72, 0x6f,
	0x74, 0x6f, 0x22, 0xa1, 0x02, 0x0a, 0x05, 0x45, 0x6e, 0x74, 0x72, 0x79, 0x12, 0x20, 0x0a, 0x0b,
	0x74, 0x72, 0x61, 0x64, 0x69, 0x74, 0x69, 0x6f, 0x6e, 0x61, 0x6c, 0x18, 0x01, 0x20, 0x01, 0x28,
	0x09, 0x52, 0x0b, 0x74, 0x72, 0x61, 0x64, 0x69, 0x74, 0x69, 0x6f, 0x6e, 0x61, 0x6c, 0x12, 0x1e,
	0x0a, 0x0a, 0x73, 0x69, 0x6d, 0x70, 0x6c, 0x69, 0x66, 0x69, 0x65, 0x64, 0x18, 0x02, 0x20, 0x01,
	0x28, 0x09, 0x52, 0x0a, 0x73, 0x69, 0x6d, 0x70, 0x6c, 0x69, 0x66, 0x69, 0x65, 0x64, 0x12, 0x16,
	0x0a, 0x06, 0x70, 0x69, 0x6e, 0x79, 0x69, 0x6e, 0x18, 0x03, 0x20, 0x01, 0x28, 0x09, 0x52, 0x06,
	0x70, 0x69, 0x6e, 0x79, 0x69, 0x6e, 0x12, 0x20, 0x0a, 0x0b, 0x64, 0x65, 0x66, 0x69, 0x6e, 0x69,
	0x74, 0x69, 0x6f, 0x6e, 0x73, 0x18, 0x04, 0x20, 0x03, 0x28, 0x09, 0x52, 0x0b, 0x64, 0x65, 0x66,
	0x69, 0x6e, 0x69, 0x74, 0x69, 0x6f, 0x6e, 0x73, 0x12, 0x12, 0x0a, 0x04, 0x74, 0x61, 0x67, 0x73,
	0x18, 0x05, 0x20, 0x03, 0x28, 0x09, 0x52, 0x04, 0x74, 0x61, 0x67, 0x73, 0x12, 0x1a, 0x0a, 0x08,
	0x65, 0x78, 0x61, 0x6d, 0x70, 0x6c, 0x65, 0x73, 0x18, 0x06, 0x20, 0x03, 0x28, 0x09, 0x52, 0x08,
	0x65, 0x78, 0x61, 0x6d, 0x70, 0x6c, 0x65, 0x73, 0x12, 0x1e, 0x0a, 0x0a, 0x70, 0x65, 0x72, 0x63,
	0x65, 0x6e, 0x74, 0x69, 0x6c, 0x65, 0x18, 0x07, 0x20, 0x01, 0x28, 0x05, 0x52, 0x0a, 0x70, 0x65,
	0x72, 0x63, 0x65, 0x6e, 0x74, 0x69, 0x6c, 0x65, 0x12, 0x1a, 0x0a, 0x08, 0x63, 0x6f, 0x6e, 0x74,
	0x61, 0x69, 0x6e, 0x73, 0x18, 0x08, 0x20, 0x03, 0x28, 0x09, 0x52, 0x08, 0x63, 0x6f, 0x6e, 0x74,
	0x61, 0x69, 0x6e, 0x73, 0x12, 0x16, 0x0a, 0x06, 0x70, 0x61, 0x72, 0x74, 0x6f, 0x66, 0x18, 0x09,
	0x20, 0x03, 0x28, 0x09, 0x52, 0x06, 0x70, 0x61, 0x72, 0x74, 0x6f, 0x66, 0x12, 0x18, 0x0a, 0x07,
	0x72, 0x65, 0x6c, 0x61, 0x74, 0x65, 0x64, 0x18, 0x0a, 0x20, 0x03, 0x28, 0x09, 0x52, 0x07, 0x72,
	0x65, 0x6c, 0x61, 0x74, 0x65, 0x64, 0x22, 0x2e, 0x0a, 0x0a, 0x44, 0x69, 0x63, 0x74, 0x69, 0x6f,
	0x6e, 0x61, 0x72, 0x79, 0x12, 0x20, 0x0a, 0x07, 0x65, 0x6e, 0x74, 0x72, 0x69, 0x65, 0x73, 0x18,
	0x01, 0x20, 0x03, 0x28, 0x0b, 0x32, 0x06, 0x2e, 0x45, 0x6e, 0x74, 0x72, 0x79, 0x52, 0x07, 0x65,
	0x6e, 0x74, 0x72, 0x69, 0x65, 0x73, 0x22, 0x65, 0x0a, 0x09, 0x43, 0x68, 0x61, 0x72, 0x61, 0x63,
	0x74, 0x65, 0x72, 0x12, 0x20, 0x0a, 0x0b, 0x74, 0x72, 0x61, 0x64, 0x69, 0x74, 0x69, 0x6f, 0x6e,
	0x61, 0x6c, 0x18, 0x01, 0x20, 0x01, 0x28, 0x09, 0x52, 0x0b, 0x74, 0x72, 0x61, 0x64, 0x69, 0x74,
	0x69, 0x6f, 0x6e, 0x61, 0x6c, 0x12, 0x1e, 0x0a, 0x0a, 0x73, 0x69, 0x6d, 0x70, 0x6c, 0x69, 0x66,
	0x69, 0x65, 0x64, 0x18, 0x02, 0x20, 0x01, 0x28, 0x09, 0x52, 0x0a, 0x73, 0x69, 0x6d, 0x70, 0x6c,
	0x69, 0x66, 0x69, 0x65, 0x64, 0x12, 0x16, 0x0a, 0x06, 0x70, 0x69, 0x6e, 0x79, 0x69, 0x6e, 0x18,
	0x03, 0x20, 0x01, 0x28, 0x09, 0x52, 0x06, 0x70, 0x69, 0x6e, 0x79, 0x69, 0x6e, 0x42, 0x0f, 0x5a,
	0x0d, 0x2e, 0x2f, 0x73, 0x65, 0x72, 0x76, 0x65, 0x72, 0x2f, 0x6d, 0x61, 0x69, 0x6e,
}

var (
	file_dictionary_proto_rawDescOnce sync.Once
	file_dictionary_proto_rawDescData = file_dictionary_proto_rawDesc
)

func file_dictionary_proto_rawDescGZIP() []byte {
	file_dictionary_proto_rawDescOnce.Do(func() {
		file_dictionary_proto_rawDescData = protoimpl.X.CompressGZIP(file_dictionary_proto_rawDescData)
	})
	return file_dictionary_proto_rawDescData
}

var file_dictionary_proto_msgTypes = make([]protoimpl.MessageInfo, 3)
var file_dictionary_proto_goTypes = []interface{}{
	(*Entry)(nil),      // 0: Entry
	(*Dictionary)(nil), // 1: Dictionary
	(*Character)(nil),  // 2: Character
}
var file_dictionary_proto_depIdxs = []int32{
	0, // 0: Dictionary.entries:type_name -> Entry
	1, // [1:1] is the sub-list for method output_type
	1, // [1:1] is the sub-list for method input_type
	1, // [1:1] is the sub-list for extension type_name
	1, // [1:1] is the sub-list for extension extendee
	0, // [0:1] is the sub-list for field type_name
}

func init() { file_dictionary_proto_init() }
func file_dictionary_proto_init() {
	if File_dictionary_proto != nil {
		return
	}
	if !protoimpl.UnsafeEnabled {
		file_dictionary_proto_msgTypes[0].Exporter = func(v interface{}, i int) interface{} {
			switch v := v.(*Entry); i {
			case 0:
				return &v.state
			case 1:
				return &v.sizeCache
			case 2:
				return &v.unknownFields
			default:
				return nil
			}
		}
		file_dictionary_proto_msgTypes[1].Exporter = func(v interface{}, i int) interface{} {
			switch v := v.(*Dictionary); i {
			case 0:
				return &v.state
			case 1:
				return &v.sizeCache
			case 2:
				return &v.unknownFields
			default:
				return nil
			}
		}
		file_dictionary_proto_msgTypes[2].Exporter = func(v interface{}, i int) interface{} {
			switch v := v.(*Character); i {
			case 0:
				return &v.state
			case 1:
				return &v.sizeCache
			case 2:
				return &v.unknownFields
			default:
				return nil
			}
		}
	}
	type x struct{}
	out := protoimpl.TypeBuilder{
		File: protoimpl.DescBuilder{
			GoPackagePath: reflect.TypeOf(x{}).PkgPath(),
			RawDescriptor: file_dictionary_proto_rawDesc,
			NumEnums:      0,
			NumMessages:   3,
			NumExtensions: 0,
			NumServices:   0,
		},
		GoTypes:           file_dictionary_proto_goTypes,
		DependencyIndexes: file_dictionary_proto_depIdxs,
		MessageInfos:      file_dictionary_proto_msgTypes,
	}.Build()
	File_dictionary_proto = out.File
	file_dictionary_proto_rawDesc = nil
	file_dictionary_proto_goTypes = nil
	file_dictionary_proto_depIdxs = nil
}