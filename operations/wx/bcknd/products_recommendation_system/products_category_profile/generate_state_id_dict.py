print()
print(
    '--------------------------------------------------------------------------------------------------------------------------------')

detected_numbers = ['12345']


# Function to form all possible numbers (length 4 or less) that do not repeat in any form or order, from a number
def form_all_possible_non_repeating_numbers_from_number_string(
        number_string,
        length_of_numbers_to_form  # 4 or less
):
    print(f'GENERATING A NUMBER OF LENGTH {length_of_numbers_to_form} FROM {number_string}')

    digit_not_fully_explored = True

    for each_number in number_string:

        detected_number_list = ['x', 'x', 'x', 'x', 'x']
        starting_number = each_number

        detected_number_list[0] = starting_number
        detected_number = detected_number_list[0]
        detected_number = ''.join(sorted(detected_number))
        print(detected_number)

        if detected_numbers.count(detected_number) == 0:
            detected_numbers.append(detected_number)

        # let all existing number occupy the second position
        if length_of_numbers_to_form > 1:

            for each_number_ in number_string:
                detected_number_list[1] = each_number_
                detected_number = [detected_number_list[0], detected_number_list[1]]
                num_to_append = detected_number_list[0] + detected_number_list[1]
                num_to_append = ''.join(sorted(num_to_append))

                # check whether the number in detected number do not repeat
                # print(set(detected_number))

                if len(set(detected_number)) == 2 and detected_numbers.count(num_to_append) == 0:
                    detected_numbers.append(num_to_append)
                    print(num_to_append)

                # let all existing number occupy the third position
                if length_of_numbers_to_form > 2:

                    for each_number__ in number_string:
                        detected_number_list[2] = each_number__
                        detected_number = [detected_number_list[0], detected_number_list[1], detected_number_list[2]]
                        num_to_append = detected_number_list[0] + detected_number_list[1] + detected_number_list[2]
                        num_to_append = ''.join(sorted(num_to_append))

                        # check whether the number in detected number do not repeat
                        if len(set(detected_number)) == 3 and detected_numbers.count(num_to_append) == 0:
                            detected_numbers.append(num_to_append)
                            print(num_to_append)

                        # let all existing number occupy the fourth position
                        if length_of_numbers_to_form > 3:

                            for each_number___ in number_string:
                                detected_number_list[3] = each_number___
                                detected_number = [detected_number_list[0], detected_number_list[1],
                                                   detected_number_list[2],
                                                   detected_number_list[3]]
                                num_to_append = detected_number_list[0] + detected_number_list[1] + \
                                                detected_number_list[2] + \
                                                detected_number_list[3]
                                num_to_append = ''.join(sorted(num_to_append))

                                # check whether the number in detected number do not repeat
                                if len(set(detected_number)) == 4 and detected_numbers.count(num_to_append) == 0:
                                    detected_numbers.append(num_to_append)
                                    print(num_to_append)

                                # let all existing number occupy the fourth position
                                if length_of_numbers_to_form > 4:

                                    for each_number___ in number_string:
                                        detected_number_list[4] = each_number___
                                        detected_number = [detected_number_list[0], detected_number_list[1],
                                                           detected_number_list[2],
                                                           detected_number_list[3], detected_number_list[4]]
                                        num_to_append = detected_number_list[0] + detected_number_list[1] + \
                                                        detected_number_list[2] + \
                                                        detected_number_list[3] + detected_number_list[4]
                                        num_to_append = ''.join(sorted(num_to_append))

                                        # check whether the number in detected number do not repeat
                                        if len(set(detected_number)) == 5 and detected_numbers.count(
                                                num_to_append) == 0:
                                            detected_numbers.append(num_to_append)
                                            print(num_to_append)

        print()
        print(f'total detected number: {len(detected_numbers)}')


# add and detect numbers (with length not more than four) that
form_all_possible_non_repeating_numbers_from_number_string(
    '123456',
    5
)

print()
print(f'detected_numbers: {len(set(detected_numbers))}')

for index in range(len(detected_numbers)):
    current_number_unproccessed = detected_numbers[index]
    detected_numbers[index] = f'{(float(detected_numbers[index]) / 1235) / 2378:.7f}'
    current_number_proccessed = detected_numbers[index]
    print(f"'{current_number_unproccessed}': '{current_number_proccessed}',")
    print()

print(len(set(detected_numbers)))