package com.prj.projectweb.mapper;

import com.prj.projectweb.dto.request.ChatCenterRequest;
import com.prj.projectweb.dto.response.ChatCenterResponse;
import com.prj.projectweb.entities.ChatCenter;
import com.prj.projectweb.entities.User;
import javax.annotation.processing.Generated;
import org.springframework.stereotype.Component;

@Generated(
    value = "org.mapstruct.ap.MappingProcessor",
    date = "2024-11-05T16:12:10+0700",
    comments = "version: 1.6.2, compiler: IncrementalProcessingEnvironment from gradle-language-java-8.10.1.jar, environment: Java 21.0.2 (Oracle Corporation)"
)
@Component
public class ChatCenterMapperImpl implements ChatCenterMapper {

    @Override
    public ChatCenterResponse toDto(ChatCenter chatCenter) {
        if ( chatCenter == null ) {
            return null;
        }

        ChatCenterResponse chatCenterResponse = new ChatCenterResponse();

        chatCenterResponse.setSenderId( chatCenterSenderUserId( chatCenter ) );
        chatCenterResponse.setReceiverId( chatCenterReceiverUserId( chatCenter ) );
        chatCenterResponse.setId( chatCenter.getId() );
        chatCenterResponse.setMessageContent( chatCenter.getMessageContent() );
        chatCenterResponse.setCreatedAt( chatCenter.getCreatedAt() );

        return chatCenterResponse;
    }

    @Override
    public ChatCenter toEntity(ChatCenterRequest chatCenterRequest) {
        if ( chatCenterRequest == null ) {
            return null;
        }

        ChatCenter.ChatCenterBuilder chatCenter = ChatCenter.builder();

        chatCenter.sender( chatCenterRequestToUser( chatCenterRequest ) );
        chatCenter.receiver( chatCenterRequestToUser1( chatCenterRequest ) );
        chatCenter.messageContent( chatCenterRequest.getMessageContent() );

        chatCenter.createdAt( java.time.LocalDateTime.now() );

        return chatCenter.build();
    }

    private Long chatCenterSenderUserId(ChatCenter chatCenter) {
        User sender = chatCenter.getSender();
        if ( sender == null ) {
            return null;
        }
        return sender.getUserId();
    }

    private Long chatCenterReceiverUserId(ChatCenter chatCenter) {
        User receiver = chatCenter.getReceiver();
        if ( receiver == null ) {
            return null;
        }
        return receiver.getUserId();
    }

    protected User chatCenterRequestToUser(ChatCenterRequest chatCenterRequest) {
        if ( chatCenterRequest == null ) {
            return null;
        }

        User.UserBuilder user = User.builder();

        user.userId( chatCenterRequest.getSenderId() );

        return user.build();
    }

    protected User chatCenterRequestToUser1(ChatCenterRequest chatCenterRequest) {
        if ( chatCenterRequest == null ) {
            return null;
        }

        User.UserBuilder user = User.builder();

        user.userId( chatCenterRequest.getReceiverId() );

        return user.build();
    }
}
