package com.prj.projectweb.enumType;

public enum VoteType {
    LIKE(1), NEUTRAL(0), DISLIKE(-1);

    private final int value;

    VoteType(int value) {
        this.value = value;
    }

    public int getValue() {
        return value;
    }

    // Phương thức để chuyển int thành VoteType
    public static VoteType fromValue(int value) {
        for (VoteType type : VoteType.values()) {
            if (type.getValue() == value) {
                return type;
            }
        }
        throw new IllegalArgumentException("Unexpected value: " + value);
    }
}
