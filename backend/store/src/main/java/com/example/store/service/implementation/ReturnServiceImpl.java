package com.example.store.service.implementation;

import com.example.store.dto.TransactionDto;
import com.example.store.dto.UserDto;
import com.example.store.models.Return;
import com.example.store.models.ReturnStatus;
import com.example.store.models.Transaction;
import com.example.store.models.UserEntity;
import com.example.store.repository.ReturnRepository;
import com.example.store.service.ReturnService;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class ReturnServiceImpl implements ReturnService {
    private final ReturnRepository returnRepository;

    public ReturnServiceImpl(ReturnRepository returnRepository) {
        this.returnRepository = returnRepository;
    }

    public List<Return> getReturnsByUser(Long userId) {
        return returnRepository.findByUserId(userId);
    }
    public List<Return> getAllReturns() {
        return returnRepository.findAll();
    }
    public Return createReturn(UserDto userDto, TransactionDto transactionDto, String reason, byte[] imageBytes) {
        Return returnRequest = new Return();
        returnRequest.setUserId(userDto.getId());
        returnRequest.setTransactionId(transactionDto.getId());
        returnRequest.setReason(reason);
        returnRequest.setImage(imageBytes);
        returnRequest.setStatus(ReturnStatus.PENDING);

        returnRepository.save(returnRequest);
        return returnRequest;
    }

    public void updateReturnStatus(Long returnId, ReturnStatus status) {
        Return returnRequest = returnRepository.findById(returnId)
                .orElseThrow(() -> new IllegalArgumentException("Return not found"));
        returnRequest.setStatus(status);
        returnRepository.save(returnRequest);
    }
}
