export const patient = {
  guid: "PAT-577683770407",
  first_name: "Moncef",
  last_name: "Sellami",
  address: "Sousse",
  zip_code: 2000,
  phone_number: 21341212,
  status: "ON_HOLD",
  responses: {
    CATEGORY_GENERAL: [
      {
        question: {
          id: 1,
          fr_value: "Étiez vous à l'étranger récemment ?",
          ar_value: "هل كنت  في الخارج مؤخرًا ؟",
          type: 1
        },
        response: {
          value: "1"
        }
      },
      {
        question: {
          id: 2,
          fr_value:
            "Étiez vous en contact avec une personne venant de l'étranger ?",
          ar_value: "هل كنت على اتصال بشخص قادم  من الخارج ؟",
          type: 1
        },
        response: {
          value: "0"
        }
      },
      {
        question: {
          id: 3,
          fr_value:
            "Étiez en contact avec une personne qui a été testée positive ?",
          ar_value: "هل كنت على اتصال بشخص كانت نتيجة اختباره إيجابية ؟",
          type: 1
        },
        response: {
          value: "1"
        }
      },
      {
        question: {
          id: 4,
          fr_value: "Quel est votre âge ?",
          ar_value: "كم عمرك ؟",
          type: 4
        },
        response: {
          value: "28 ans"
        }
      }
    ],
    CATEGORY_ANTECEDENT: [
      {
        question: {
          id: 5,
          fr_value: "Êtes vous diabétique ? (oui, non)",
          ar_value: "هل تعاني من مرض السكري ؟",
          type: 1
        },
        response: {
          value: "0"
        }
      },
      {
        question: {
          id: 6,
          fr_value:
            "Avez vous une maladie respiratoire ? êtes vous suivi par un pneumologue ? (oui, non)",
          ar_value:
            "هل تعاني من مرض تنفسي؟ هل يتابعك طبيب مختص في أمراض الرئة ؟",
          type: 1
        },
        response: {
          value: "1"
        }
      },
      {
        question: {
          id: 7,
          fr_value:
            "Avez-vous de l'hypertension artérielle ? Ou avez-vous une maladie cardiaque ou vasculaire ? Ou prenez-vous un traitement à visée cardiologique ? (oui, non, je ne sais pas)",
          ar_value:
            "هل تعاني من ارتفاع ضغط الدم؟ أو لديك مرض القلب أو الأوعية الدموية؟ هل  تأخذ علاج للقلب ؟",
          type: 2
        },
        response: {
          value: "2"
        }
      },
      {
        question: {
          id: 8,
          fr_value:
            "Avez-vous une insuffisance rénale chronique dialysée ? (oui, non)",
          ar_value: "هل تعاني من قصور كلوي ؟",
          type: 1
        },
        response: {
          value: "1"
        }
      },
      {
        question: {
          id: 9,
          fr_value: "Avez-vous une maladie chronique de foie ? (oui, non)",
          ar_value: "هل لديك مرض مزمن في الكبد ؟",
          type: 1
        },
        response: {
          value: "0"
        }
      },
      {
        question: {
          id: 10,
          fr_value: "Avez vous ou avez vous eu un cancer ? (oui, non)",
          ar_value: "هل لديك أو كان  لديك مرض سرطان ؟",
          type: 1
        },
        response: {
          value: "0"
        }
      },
      {
        question: {
          id: 11,
          fr_value: "Êtes vous enceinte ?(oui, non, non applicable) ?",
          ar_value: "هل أنت حامل ؟",
          type: 3
        },
        response: {
          value: "2"
        }
      },
      {
        question: {
          id: 12,
          fr_value:
            "Avez-vous une maladie connue diminuer vos défenses immunitaires ? (oui, non)",
          ar_value: "هل تعاني من مرض ينقص من مناعتك؟",
          type: 1
        },
        response: {
          value: "1"
        }
      },
      {
        question: {
          id: 13,
          fr_value: "Prenez vous un traitement immunosuppresseur ? (oui, non)",
          ar_value: "هل تتناول علاج مثبط للمناعة ؟",
          type: 1
        },
        response: {
          value: "0"
        }
      }
    ],
    CATEGORY_SYMPTOMS: [
      {
        question: {
          id: 14,
          fr_value:
            "Avez-vous de la fièvre, des frissons, des sueurs ? (oui, non)",
          ar_value: "هل تعاني من الحمى والرعشة والتعرق ؟",
          type: 1
        },
        response: {
          value: "1"
        }
      },
      {
        question: {
          id: 15,
          fr_value: "Si oui indiquez la temperature ?",
          ar_value: "إذا كان الجواب نعم ، حدد درجة الحرارة؟",
          type: 4
        },
        response: {
          value: "38 degré"
        }
      },
      {
        question: {
          id: 16,
          fr_value:
            "Avez-vous une toux ou une augmentation de votre toux habituelle ces derniers jours ? (oui, non)",
          ar_value:
            "هل تعاني من السعال  أو زيادة في السعال المعتاد  في الأيام القليلة الماضية ؟",
          type: 1
        },
        response: {
          value: "1"
        }
      },
      {
        question: {
          id: 17,
          fr_value:
            "Avez-vous un mal de gorge apparu ces derniers jours ? (oui, non)",
          ar_value: "هل أصبت بالتهاب حنجرة  في الأيام الأخيرة ؟",
          type: 1
        },
        response: {
          value: "0"
        }
      },
      {
        question: {
          id: 18,
          fr_value: "Avez-vous des maux de tête ? (oui, non)",
          ar_value: "هل تعاني من آلام بالرأس ؟",
          type: 1
        },
        response: {
          value: "1"
        }
      },
      {
        question: {
          id: 19,
          fr_value:
            "Avez-vous des douleurs musculaires ou des courbatures inhabituelles ces derniers jours ? (oui, non)",
          ar_value:
            "هل عانيت من آلام أو آلام عضلية غير معتادة في الأيام القليلة الماضية ؟",
          type: 1
        },
        response: {
          value: "0"
        }
      },
      {
        question: {
          id: 20,
          fr_value:
            "Avez-vous une fatigue inhabituelle ces derniers jours ? (oui, non)",
          ar_value: "هل تعاني من تعب غير معتاد  في الأيام الأخيرة ؟",
          type: 1
        },
        response: {
          value: "1"
        }
      },
      {
        question: {
          id: 21,
          fr_value:
            "Avez-vous une gêne respiratoire ou une augmentation de votre gêne respiratoire inhabituelle ? (oui, non)",
          ar_value: "هل  تعاني من صعوبة في التنفس ؟",
          type: 1
        },
        response: {
          value: "0"
        }
      }
    ]
  }
};
